<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\RentalRequest;

class TestRentalRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a customer
        $customer = Customer::firstOrCreate(
            ['name' => 'Test Customer'],
            [
                'contact_number' => '09123456789',
                'address' => 'Test Address',
                'status' => 'active',
                'total_rentals' => 0,
                'join_date' => now(),
            ]
        );

        // Create test rental requests with different statuses
        $testRequests = [
            [
                'customer_id' => $customer->id,
                'tank_type' => 'Medical Oxygen',
                'quantity' => 2,
                'start_date' => now()->subDays(5),
                'end_date' => now()->addDays(2), // Due in 2 days
                'purpose' => 'Medical use',
                'contact_number' => '09123456789',
                'address' => 'Test Address',
                'status' => 'approved'
            ],
            [
                'customer_id' => $customer->id,
                'tank_type' => 'Industrial Oxygen',
                'quantity' => 1,
                'start_date' => now()->subDays(10),
                'end_date' => now()->subDays(1), // Overdue by 1 day
                'purpose' => 'Industrial use',
                'contact_number' => '09123456789',
                'address' => 'Test Address',
                'status' => 'approved'
            ],
            [
                'customer_id' => $customer->id,
                'tank_type' => 'Argon Tank',
                'quantity' => 3,
                'start_date' => now()->subDays(3),
                'end_date' => now()->addDays(5), // Due in 5 days (outside 3-day window)
                'purpose' => 'Welding use',
                'contact_number' => '09123456789',
                'address' => 'Test Address',
                'status' => 'approved'
            ]
        ];

        foreach ($testRequests as $request) {
            RentalRequest::create($request);
        }

        $this->command->info('Test rental requests created for Tanks Due for Return feature');
    }
}
