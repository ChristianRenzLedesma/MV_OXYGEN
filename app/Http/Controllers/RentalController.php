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

    public function approve(RentalRequest $rentalRequest)
    {
        \Log::info('Approving rental request: ' . $rentalRequest->id . ' with status: ' . $rentalRequest->status);

        $rentalRequest->update(['status' => 'approved']);
        \Log::info('Updated rental request status to approved');

        // Log activity
        $admin = auth()->user();
        $action = $rentalRequest->request_type === 'refill' ? 'refill_approved' : 'rental_approved';
        $requestType = $rentalRequest->request_type === 'refill' ? 'refill' : 'rental';
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
        \App\Models\Activity::create([
            'user_id' => $admin->id,
            'customer_id' => $rentalRequest->customer_id,
            'rental_request_id' => $rentalRequest->id,
            'action' => 'rental_rejected',
            'description' => "Admin {$admin->name} rejected rental request for {$rentalRequest->tank_type} from {$rentalRequest->customer->name}. Reason: {$request->rejected_reason}",
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
