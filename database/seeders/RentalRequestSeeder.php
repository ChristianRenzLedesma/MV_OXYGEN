<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RentalRequest;
use App\Models\Customer;
use Carbon\Carbon;

class RentalRequestSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create a sample customer (exclude Admin)
        $customer = Customer::where('name', '!=', 'Admin')->first();
        
        if (!$customer) {
            $customer = Customer::create([
                'name' => 'Juan Dela Cruz',
                'email' => 'juan.delacruz@example.com',
                'address' => '123 Main Street, Manila, Philippines',
                'phone' => '09123456789',
                'status' => 'active'
            ]);
        }

        // Create sample rental requests
        RentalRequest::create([
            'customer_id' => $customer->id,
            'product_id' => null,
            'tank_type' => 'Medical Oxygen',
            'quantity' => 2,
            'start_date' => Carbon::today()->addDays(5),
            'end_date' => Carbon::today()->addDays(12),
            'purpose' => 'Medical use for home care',
            'contact_number' => '0912-345-6789',
            'address' => '123 Medical Center, Manila',
            'status' => 'pending',
            'admin_notes' => null,
            'rejected_reason' => null
        ]);

        RentalRequest::create([
            'customer_id' => $customer->id,
            'product_id' => null,
            'tank_type' => 'Industrial Oxygen',
            'quantity' => 1,
            'start_date' => Carbon::today()->addDays(8),
            'end_date' => Carbon::today()->addDays(15),
            'purpose' => 'Welding project',
            'contact_number' => '0987-654-3210',
            'address' => '456 Industrial Area, Quezon City',
            'status' => 'pending',
            'admin_notes' => null,
            'rejected_reason' => null
        ]);

        RentalRequest::create([
            'customer_id' => $customer->id,
            'product_id' => null,
            'tank_type' => 'Argon Tank',
            'quantity' => 3,
            'start_date' => Carbon::today()->subDays(10),
            'end_date' => Carbon::today()->subDays(3),
            'purpose' => 'Laboratory research',
            'contact_number' => '0955-123-4567',
            'address' => '789 Research Facility, Makati',
            'status' => 'approved',
            'admin_notes' => 'Approved for laboratory use',
            'rejected_reason' => null
        ]);

        RentalRequest::create([
            'customer_id' => $customer->id,
            'product_id' => null,
            'tank_type' => 'NitroGen',
            'quantity' => 1,
            'start_date' => Carbon::today()->subDays(20),
            'end_date' => Carbon::today()->subDays(15),
            'purpose' => 'Food packaging',
            'contact_number' => '0922-987-6543',
            'address' => '321 Food Processing Plant, Pasig',
            'status' => 'rejected',
            'admin_notes' => null,
            'rejected_reason' => 'Insufficient stock available'
        ]);
    }
}
