<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Get the test user
$user = App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    // Create customer record for the test user
    $customer = App\Models\Customer::create([
        'name' => $user->name,
        'email' => $user->email,
        'address' => '123 Test Street, Test City',
        'phone' => $user->phone,
        'contact_number' => $user->phone,
        'status' => 'active',
        'join_date' => now()->toDateString()
    ]);
    
    echo 'Created customer record for test user:' . PHP_EOL;
    echo 'User ID: ' . $user->id . PHP_EOL;
    echo 'Customer ID: ' . $customer->id . PHP_EOL;
    echo 'Email: ' . $customer->email . PHP_EOL;
    echo 'Status: ' . $customer->status . PHP_EOL;
    
    // Update some rental requests to belong to this customer
    $rentalRequests = App\Models\RentalRequest::where('customer_id', 1)->get();
    $count = 0;
    
    foreach ($rentalRequests as $request) {
        if ($count < 2) { // Assign first 2 requests to test user
            $request->customer_id = $customer->id;
            $request->save();
            $count++;
        }
    }
    
    echo 'Assigned ' . $count . ' rental requests to test user' . PHP_EOL;
    
} else {
    echo 'Test user not found' . PHP_EOL;
}
