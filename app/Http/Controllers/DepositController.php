<?php

namespace App\Http\Controllers;

use App\Models\Deposit;
use App\Models\Rental;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepositController extends Controller
{
    /**
     * Store a newly created deposit in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'rental_id' => 'required|exists:rentals,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $rental = Rental::findOrFail($request->rental_id);

        Deposit::create([
            'rental_id' => $rental->id,
            'customer_id' => $rental->customer_id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'reference_number' => $request->reference_number,
            'status' => 'paid',
            'payment_date' => now(),
            'notes' => $request->notes,
        ]);

        // Update rental with deposit information
        $rental->update([
            'deposit_amount' => $request->amount,
            'deposit_payment_method' => $request->payment_method,
            'deposit_payment_date' => now(),
            'deposit_status' => 'paid',
            'deposit_reference_number' => $request->reference_number,
        ]);

        return back()->with('success', 'Deposit recorded successfully.');
    }

    /**
     * Update the specified deposit in storage.
     */
    public function update(Request $request, Deposit $deposit)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'status' => 'required|in:pending,paid,refunded',
            'notes' => 'nullable|string',
        ]);

        $deposit->update($request->all());

        // Update rental with deposit information
        if ($deposit->rental) {
            $deposit->rental->update([
                'deposit_amount' => $request->amount,
                'deposit_payment_method' => $request->payment_method,
                'deposit_status' => $request->status,
                'deposit_reference_number' => $request->reference_number,
            ]);
        }

        return back()->with('success', 'Deposit updated successfully.');
    }

    /**
     * Remove the specified deposit from storage.
     */
    public function destroy(Deposit $deposit)
    {
        $rental = $deposit->rental;

        $deposit->delete();

        if ($rental) {
            $rental->update([
                'deposit_amount' => null,
                'deposit_payment_method' => null,
                'deposit_payment_date' => null,
                'deposit_status' => 'pending',
                'deposit_reference_number' => null,
            ]);
        }

        return back()->with('success', 'Deposit deleted successfully.');
    }

    /**
     * Update deposit information for a rental directly.
     */
    public function updateRentalDeposit(Request $request, Rental $rental)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $rental->update([
            'deposit_amount' => $request->amount,
            'deposit_payment_method' => $request->payment_method,
            'deposit_payment_date' => now(),
            'deposit_status' => 'paid',
            'deposit_reference_number' => $request->reference_number,
        ]);

        // Check if a deposit record exists for this rental
        $deposit = Deposit::where('rental_id', $rental->id)->first();
        if ($deposit) {
            $deposit->update([
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'reference_number' => $request->reference_number,
                'status' => 'paid',
                'payment_date' => now(),
                'notes' => $request->notes,
            ]);
        } else {
            Deposit::create([
                'rental_id' => $rental->id,
                'customer_id' => $rental->customer_id,
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'reference_number' => $request->reference_number,
                'status' => 'paid',
                'payment_date' => now(),
                'notes' => $request->notes,
            ]);
        }

        return back()->with('success', 'Deposit updated successfully.');
    }
}
