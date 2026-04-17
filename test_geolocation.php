<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\Customer;
use App\Models\User;

// Create a test customer if it doesn't exist
$user = User::where('email', 'testuser@example.com')->first();
if ($user) {
    $customer = Customer::firstOrCreate(
        ['name' => $user->name],
        [
            'contact_number' => '09914458507',
            'address' => 'Manila, Philippines',
            'status' => 'active',
            'total_rentals' => 0,
            'join_date' => now(),
        ]
    );
    echo 'Test customer created/updated: ' . $customer->name . ' (ID: ' . $customer->id . ")\n";
    
    // Create a test rental request with geolocation
    $rentalRequest = \App\Models\RentalRequest::create([
        'customer_id' => $customer->id,
        'product_id' => null,
        'tank_type' => 'Medical Oxygen',
        'quantity' => 1,
        'start_date' => now()->addDays(1)->format('Y-m-d'),
        'end_date' => now()->addDays(7)->format('Y-m-d'),
        'purpose' => 'Test rental request for geolocation tracking',
        'contact_number' => '09914458507',
        'address' => 'Quezon City, Philippines',
        'delivery_address' => 'Quezon City, Philippines',
        'delivery_lat' => 14.6760,
        'delivery_lng' => 121.0437,
        'status' => 'approved',
        'admin_notes' => null,
        'rejected_reason' => null
    ]);
    
    echo 'Test rental request created: ID ' . $rentalRequest->id . "\n";
    echo 'Delivery coordinates: ' . $rentalRequest->delivery_lat . ', ' . $rentalRequest->delivery_lng . "\n";
    echo 'Status: ' . $rentalRequest->status . "\n";
    echo 'You can now track this rental at: /user/rentals/' . $rentalRequest->id . '/track\n';
} else {
    echo 'Test user not found. Creating test user first...\n';
}
