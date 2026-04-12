<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin user
        $admin = User::where('role', 'admin')->first();
        
        // Get all customer users
        $customers = User::where('role', 'customer')->get();

        // Clear existing notifications to avoid duplicates
        Notification::truncate();

        if ($admin) {
            // Admin notifications
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'warning',
                'title' => 'Tank Rental Pending',
                'message' => '3 tank rental requests awaiting approval',
                'link' => '/customer',
                'read' => false,
            ]);

            Notification::create([
                'user_id' => $admin->id,
                'type' => 'info',
                'title' => 'Low Inventory Alert',
                'message' => 'Medical Oxygen tanks running low (2 remaining)',
                'link' => '/dashboard',
                'read' => false,
            ]);

            Notification::create([
                'user_id' => $admin->id,
                'type' => 'success',
                'title' => 'New Customer Registered',
                'message' => 'John Doe has registered as a new customer',
                'link' => '/customer',
                'read' => true,
            ]);

            Notification::create([
                'user_id' => $admin->id,
                'type' => 'warning',
                'title' => 'Overdue Tanks',
                'message' => '2 tanks are overdue for return',
                'link' => '/customer',
                'read' => true,
            ]);
        }

        // Create notifications for ALL customer users
        foreach ($customers as $customer) {
            // Customer notifications
            Notification::create([
                'user_id' => $customer->id,
                'type' => 'success',
                'title' => 'Rental Approved',
                'message' => 'Your Argon Tank rental has been approved',
                'link' => '/user/rentals',
                'read' => false,
            ]);

            Notification::create([
                'user_id' => $customer->id,
                'type' => 'info',
                'title' => 'Tank Available',
                'message' => 'Medical Oxygen tank is now available for rental',
                'link' => '/user/rentals/create',
                'read' => false,
            ]);

            Notification::create([
                'user_id' => $customer->id,
                'type' => 'warning',
                'title' => 'Return Reminder',
                'message' => 'Your tank rental is due for return tomorrow',
                'link' => '/user/rentals',
                'read' => true,
            ]);
        }
    }
}
