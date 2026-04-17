<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Check if admin already exists
        $admin = User::where('email', 'admin@example.com')->first();
        
        if (!$admin) {
            // Create admin user
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'is_active' => true,
            ]);
            
            $this->command->info('Admin user created successfully.');
        } else {
            // Update existing admin password
            $admin->update([
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'is_active' => true,
            ]);
            
            $this->command->info('Admin user updated successfully.');
        }
    }
}
