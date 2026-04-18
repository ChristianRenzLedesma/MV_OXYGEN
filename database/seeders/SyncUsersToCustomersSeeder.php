<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Customer;

class SyncUsersToCustomersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        foreach ($users as $user) {
            // Check if customer already exists for this user
            $existingCustomer = Customer::where('name', $user->name)->first();
            
            if (!$existingCustomer) {
                Customer::create([
                    'name' => $user->name,
                    'contact_number' => $user->phone ?? 'N/A',
                    'address' => 'N/A',
                    'status' => 'active',
                    'total_rentals' => 0,
                    'join_date' => now()->toDateString()
                ]);
                
                echo "Created customer for user: {$user->name}\n";
            } else {
                echo "Customer already exists for user: {$user->name}\n";
            }
        }
        
        echo "Sync completed.\n";
    }
}
