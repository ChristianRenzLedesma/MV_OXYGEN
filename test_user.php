<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Check test user
$user = \App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    echo "User found: " . $user->name . " (ID: " . $user->id . ")\n";
    echo "Role: " . $user->role . "\n";
    echo "Phone: " . $user->phone . "\n";
    
    // Check customer record
    $customer = \App\Models\Customer::where('name', $user->name)->first();
    if ($customer) {
        echo "Customer found: " . $customer->name . " (ID: " . $customer->id . ")\n";
        echo "Customer address: " . $customer->address . "\n";
        echo "Customer phone: " . $customer->contact_number . "\n";
    } else {
        echo "No customer record found\n";
    }
} else {
    echo "Test user not found\n";
}
