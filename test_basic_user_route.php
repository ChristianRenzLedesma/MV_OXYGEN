<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo 'Testing basic user route access...' . PHP_EOL;

// Test if the user dashboard route exists
$routeCollection = \Illuminate\Support\Facades\Route::getRoutes();
$foundRoute = null;

foreach ($routeCollection as $route) {
    if ($route->uri() === 'user/dashboard') {
        $foundRoute = $route;
        break;
    }
}

if ($foundRoute) {
    echo 'Route found: user/dashboard' . PHP_EOL;
    echo 'Action: ' . $foundRoute->getActionName() . PHP_EOL;
    echo 'Methods: ' . implode(', ', $foundRoute->methods()) . PHP_EOL;
} else {
    echo 'Route NOT found: user/dashboard' . PHP_EOL;
}

// Test authentication
$user = \App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    echo 'Test user exists: ' . $user->email . PHP_EOL;
    echo 'User ID: ' . $user->id . PHP_EOL;
    echo 'Email verified: ' . ($user->email_verified_at ? 'Yes' : 'No') . PHP_EOL;
    
    // Test customer linking
    $customer = \App\Models\Customer::where('name', $user->name)
        ->orWhere('contact_number', $user->phone)
        ->first();
    
    if ($customer) {
        echo 'Customer found: ID ' . $customer->id . PHP_EOL;
    } else {
        echo 'Customer NOT found for user' . PHP_EOL;
    }
} else {
    echo 'Test user NOT found' . PHP_EOL;
}
