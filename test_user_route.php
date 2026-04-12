<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Test the user dashboard controller directly
use App\Http\Controllers\UserDashboardController;

echo 'Testing UserDashboardController directly...' . PHP_EOL;

// Create a mock request
$request = new \Illuminate\Http\Request();

// Simulate authentication
$user = \App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    echo 'User found: ' . $user->email . PHP_EOL;
    
    // Authenticate the user
    \Illuminate\Support\Facades\Auth::login($user);
    
    // Create controller instance
    $controller = new UserDashboardController();
    
    try {
        // Call the index method
        $response = $controller->index();
        echo 'Controller method executed successfully' . PHP_EOL;
        echo 'Response type: ' . get_class($response) . PHP_EOL;
        
        if ($response instanceof \Inertia\Response) {
            echo 'Inertia response created' . PHP_EOL;
            echo 'Component: ' . $response->component . PHP_EOL;
            echo 'Props available: ' . (isset($response->props) ? 'Yes' : 'No') . PHP_EOL;
        }
        
    } catch (\Exception $e) {
        echo 'Error in controller: ' . $e->getMessage() . PHP_EOL;
        echo 'File: ' . $e->getFile() . ':' . $e->getLine() . PHP_EOL;
    }
    
} else {
    echo 'Test user not found' . PHP_EOL;
}
