<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\RentalRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\RentalApprovedMail;
use Inertia\Inertia;

class RentalController extends Controller
{
    public function index()
    {
        $rentalRequests = RentalRequest::with(['customer', 'product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('rentals/index', [
            'rentalRequests' => $rentalRequests,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function refills()
    {
        $rentalRequests = RentalRequest::with(['customer', 'product'])
            ->where('request_type', 'refill')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('refills/index', [
            'rentalRequests' => $rentalRequests,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function storeRefill(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'tank_type' => 'required|string|max:255',
            'refill_period' => 'required|string|max:100',
            'refill_cost' => 'required|numeric|min:0'
        ]);

        $customer = Customer::findOrFail($request->customer_id);

        $rentalRequest = RentalRequest::create([
            'customer_id' => $customer->id,
            'request_type' => 'refill',
            'product_id' => null,
            'tank_type' => $request->tank_type,
            'quantity' => 1,
            'start_date' => now()->addDay()->format('Y-m-d'),
            'end_date' => now()->addDays(7)->format('Y-m-d'),
            'purpose' => "Refill period: {$request->refill_period}",
            'contact_number' => $customer->contact_number ?? 'N/A',
            'address' => $customer->address ?? 'N/A',
            'status' => 'pending',
            'admin_notes' => null,
            'rejected_reason' => null
        ]);

        // Log activity
        $admin = auth()->user();
        \App\Models\Activity::create([
            'user_id' => $admin->id,
            'customer_id' => $customer->id,
            'rental_request_id' => $rentalRequest->id,
            'action' => 'refill_created',
            'description' => "Admin {$admin->name} created a refill oxygen customer request for {$request->tank_type} for {$customer->name}",
            'type' => 'info',
        ]);

        return redirect()->route('refills.index')->with('success', 'Refill request created successfully!');
    }

    public function approve(RentalRequest $rentalRequest)
    {
        \Log::info('Approving rental request: ' . $rentalRequest->id . ' with status: ' . $rentalRequest->status);

        $rentalRequest->update(['status' => 'approved']);
        \Log::info('Updated rental request status to approved');

        // Log activity
        $admin = auth()->user();
        $action = $rentalRequest->request_type === 'refill' ? 'refill_approved' : 'rental_approved';
        $requestType = $rentalRequest->request_type === 'refill' ? 'refill oxygen customer' : 'rental';
        \App\Models\Activity::create([
            'user_id' => $admin->id,
            'customer_id' => $rentalRequest->customer_id,
            'rental_request_id' => $rentalRequest->id,
            'action' => $action,
            'description' => "Admin {$admin->name} approved {$requestType} request for {$rentalRequest->tank_type} from {$rentalRequest->customer->name}",
            'type' => 'success',
        ]);

        // Create rental record
        $rentalData = [
            'rental_request_id' => $rentalRequest->id,
            'customer_id' => $rentalRequest->customer_id,
            'product_id' => $rentalRequest->product_id,
            'start_date' => $rentalRequest->start_date,
            'end_date' => $rentalRequest->end_date,
            'status' => 'active',
            'pickup_date' => now(),
        ];

        // Create transaction record
        \App\Models\Transaction::create([
            'customer_id' => $rentalRequest->customer_id,
            'tank_id' => $rentalRequest->tank_type,
            'transaction_type' => $rentalRequest->request_type === 'refill' ? 'Refill' : 'Rent',
            'transaction_date' => now(),
        ]);
        
        \Log::info('Creating rental with data: ', $rentalData);
        
        $rental = Rental::create($rentalData);
        \Log::info('Created rental record: ' . $rental->id . ' with status: ' . $rental->status);

        // Send notification to customer
        try {
            Mail::to($rentalRequest->customer->email)->send(new RentalApprovedMail($rentalRequest));
        } catch (\Exception $e) {
            \Log::error('Failed to send approval email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Rental request approved and customer notified.');
    }

    public function reject(Request $request, RentalRequest $rentalRequest)
    {
        $request->validate([
            'rejected_reason' => 'required|string|max:500'
        ]);

        $rentalRequest->update([
            'status' => 'rejected',
            'rejected_reason' => $request->rejected_reason
        ]);

        // Log activity
        $admin = auth()->user();
        $requestType = $rentalRequest->request_type === 'refill' ? 'refill oxygen customer' : 'rental';
        \App\Models\Activity::create([
            'user_id' => $admin->id,
            'customer_id' => $rentalRequest->customer_id,
            'rental_request_id' => $rentalRequest->id,
            'action' => 'rental_rejected',
            'description' => "Admin {$admin->name} rejected {$requestType} request for {$rentalRequest->tank_type} from {$rentalRequest->customer->name}. Reason: {$request->rejected_reason}",
            'type' => 'error',
        ]);

        return redirect()->back()->with('success', 'Rental request rejected.');
    }

    public function show(RentalRequest $rentalRequest)
    {
        $rentalRequest->load(['customer', 'product', 'rental']);

        $view = $rentalRequest->request_type === 'refill' ? 'refills/show' : 'rentals/show';

        return Inertia::render($view, [
            'rentalRequest' => $rentalRequest,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function updateNotes(Request $request, RentalRequest $rentalRequest)
    {
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        $rentalRequest->update(['admin_notes' => $request->admin_notes]);

        return redirect()->back()->with('success', 'Notes updated successfully.');
    }

    public function cancel(RentalRequest $rentalRequest)
    {
        // Only allow cancellation of pending requests
        if ($rentalRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'Only pending rental requests can be cancelled.');
        }

        // Update rental request status to canceled (8 chars to fit enum)
        $rentalRequest->update(['status' => 'canceled']);

        return redirect()->back()->with('success', 'Rental request canceled successfully.');
    }

    public function markAsReturned(RentalRequest $rentalRequest)
    {
        // Update rental request status to completed
        $rentalRequest->update(['status' => 'completed']);

        // Create transaction record for return
        \App\Models\Transaction::create([
            'customer_id' => $rentalRequest->customer_id,
            'tank_id' => $rentalRequest->tank_type,
            'transaction_type' => 'Returned',
            'transaction_date' => now(),
        ]);

        // Log activity
        $admin = auth()->user();
        \App\Models\Activity::create([
            'user_id' => $admin->id,
            'customer_id' => $rentalRequest->customer_id,
            'rental_request_id' => $rentalRequest->id,
            'action' => 'rental_completed',
            'description' => "Admin {$admin->name} marked rental request for {$rentalRequest->tank_type} from {$rentalRequest->customer->name} as completed",
            'type' => 'success',
        ]);

        // Update corresponding rental record if it exists
        if ($rentalRequest->rental) {
            $rentalRequest->rental->update([
                'status' => 'completed',
                'return_date' => now()
            ]);
        }

        return redirect()->back()->with('success', 'Tank marked as returned successfully.');
    }
}
