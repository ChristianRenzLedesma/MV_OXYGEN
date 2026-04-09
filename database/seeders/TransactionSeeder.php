<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Customer;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample customers first
        $juan = Customer::create([
            'name' => 'Juan Dela Cruz',
            'contact_number' => '0912-345-6789',
            'address' => '123 Main St, Manila',
            'status' => 'active',
            'total_rentals' => 3,
        ]);

        $pedro = Customer::create([
            'name' => 'Jose Reyes',
            'contact_number' => '0913-456-7890',
            'address' => '456 Oak Ave, Quezon City',
            'status' => 'active',
            'total_rentals' => 2,
        ]);

        $renz = Customer::create([
            'name' => 'Maria Santos',
            'contact_number' => '0914-567-8901',
            'address' => '789 Pine Rd, Makati',
            'status' => 'active',
            'total_rentals' => 1,
        ]);

        // Create transactions for these customers
        $transactions = [
            [
                'customer_id' => $juan->customer_id,
                'tank_id' => '01',
                'transaction_type' => 'Rent',
                'transaction_date' => '2026-02-20',
            ],
            [
                'customer_id' => $juan->customer_id,
                'tank_id' => '02',
                'transaction_type' => 'Returned',
                'transaction_date' => '2026-03-01',
            ],
            [
                'customer_id' => $juan->customer_id,
                'tank_id' => '03',
                'transaction_type' => 'Refill',
                'transaction_date' => '2026-03-15',
            ],
            [
                'customer_id' => $pedro->customer_id,
                'tank_id' => '04',
                'transaction_type' => 'Rent',
                'transaction_date' => '2026-02-25',
            ],
            [
                'customer_id' => $pedro->customer_id,
                'tank_id' => '05',
                'transaction_type' => 'Returned',
                'transaction_date' => '2026-03-05',
            ],
            [
                'customer_id' => $renz->customer_id,
                'tank_id' => '06',
                'transaction_type' => 'Rent',
                'transaction_date' => '2026-03-10',
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}
