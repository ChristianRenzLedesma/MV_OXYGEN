<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Juan Mercado',
                'contact_number' => '0912-345-6789',
                'address' => '123 Main St, Manila',
                'status' => 'active',
                'total_rentals' => 15,
                'join_date' => '2024-01-15',
            ],
            [
                'name' => 'Renz Ledesma',
                'contact_number' => '0912-345-6790',
                'address' => '456 Oak Ave, Quezon City',
                'status' => 'active',
                'total_rentals' => 8,
                'join_date' => '2024-02-20',
            ],
            [
                'name' => 'Pedro Penduko',
                'contact_number' => '0912-345-6791',
                'address' => '789 Elm St, Makati',
                'status' => 'inactive',
                'total_rentals' => 23,
                'join_date' => '2023-12-10',
            ],
            [
                'name' => 'Maria Santos',
                'contact_number' => '0912-345-6792',
                'address' => '321 Pine St, Pasig',
                'status' => 'active',
                'total_rentals' => 12,
                'join_date' => '2024-03-05',
            ],
            [
                'name' => 'Carlos Reyes',
                'contact_number' => '0912-345-6793',
                'address' => '654 Maple Ave, Mandaluyong',
                'status' => 'active',
                'total_rentals' => 19,
                'join_date' => '2024-01-28',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
