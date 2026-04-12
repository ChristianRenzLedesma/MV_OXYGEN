<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Simulate user authentication
$user = App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    echo 'Testing user dashboard data...' . PHP_EOL;
    echo 'User ID: ' . $user->id . PHP_EOL;
    echo 'User Email: ' . $user->email . PHP_EOL;
    
    // Get user's customer record (match by name or contact number)
    $customer = App\Models\Customer::where('name', $user->name)
        ->orWhere('contact_number', $user->phone)
        ->first();
    if ($customer) {
        echo 'Customer ID: ' . $customer->id . PHP_EOL;
        
        // Get rental requests
        $rentalRequests = App\Models\RentalRequest::where('customer_id', $customer->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
        
        echo 'Rental Requests Count: ' . $rentalRequests->count() . PHP_EOL;
        
        // Get active rentals
        $activeRentals = App\Models\Rental::where('customer_id', $customer->id)
            ->where('status', 'active')
            ->with(['rentalRequest'])
            ->get();
        
        echo 'Active Rentals Count: ' . $activeRentals->count() . PHP_EOL;
        
        // Get stats
        $stats = [
            'pending_requests' => App\Models\RentalRequest::where('customer_id', $customer->id)->where('status', 'pending')->count(),
            'approved_requests' => App\Models\RentalRequest::where('customer_id', $customer->id)->where('status', 'approved')->count(),
            'active_rentals' => App\Models\Rental::where('customer_id', $customer->id)->where('status', 'active')->count(),
            'completed_rentals' => App\Models\Rental::where('customer_id', $customer->id)->where('status', 'completed')->count(),
        ];
        
        echo 'Stats: ' . json_encode($stats) . PHP_EOL;
        
        echo 'User dashboard data test completed successfully!' . PHP_EOL;
    } else {
        echo 'Customer record not found for user' . PHP_EOL;
    }
} else {
    echo 'Test user not found' . PHP_EOL;
}
