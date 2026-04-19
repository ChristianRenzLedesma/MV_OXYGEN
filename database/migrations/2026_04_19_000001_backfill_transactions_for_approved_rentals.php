<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\RentalRequest;
use App\Models\Transaction;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all approved rental requests that don't have transactions
        $approvedRentals = RentalRequest::where('status', 'approved')
            ->whereDoesntHave('customer.transactions')
            ->with('customer')
            ->get();

        foreach ($approvedRentals as $rental) {
            Transaction::create([
                'customer_id' => $rental->customer_id,
                'tank_id' => $rental->tank_type,
                'transaction_type' => $rental->request_type === 'refill' ? 'Refill' : 'Rent',
                'transaction_date' => $rental->created_at,
            ]);
        }

        // Get all completed rental requests that don't have returned transactions
        $completedRentals = RentalRequest::where('status', 'completed')
            ->whereDoesntHave('customer.transactions', function ($query) {
                $query->where('transaction_type', 'Returned');
            })
            ->with('customer')
            ->get();

        foreach ($completedRentals as $rental) {
            Transaction::create([
                'customer_id' => $rental->customer_id,
                'tank_id' => $rental->tank_type,
                'transaction_type' => 'Returned',
                'transaction_date' => $rental->updated_at,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove transactions that were created by this migration
        // This is a no-op since we can't easily identify which transactions were created by this migration
    }
};
