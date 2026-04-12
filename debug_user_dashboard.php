<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Test the exact data being passed to the user dashboard
use App\Http\Controllers\UserDashboardController;

echo 'Debugging User Dashboard Data...' . PHP_EOL;

// Simulate authentication
$user = \App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    echo 'User authenticated: ' . $user->email . PHP_EOL;
    
    // Authenticate the user
    \Illuminate\Support\Facades\Auth::login($user);
    
    // Create controller instance
    $controller = new UserDashboardController();
    
    try {
        // Call the index method
        $response = $controller->index();
        
        if ($response instanceof \Inertia\Response) {
            echo 'Inertia response created' . PHP_EOL;
            
            // Use reflection to access protected properties
            $reflection = new ReflectionClass($response);
            $componentProperty = $reflection->getProperty('component');
            $componentProperty->setAccessible(true);
            $propsProperty = $reflection->getProperty('props');
            $propsProperty->setAccessible(true);
            
            $component = $componentProperty->getValue($response);
            $props = $propsProperty->getValue($response);
            
            echo 'Component: ' . $component . PHP_EOL;
            echo 'Props: ' . PHP_EOL;
            print_r($props);
            
            // Check if props have expected structure
            if (isset($props['rentalRequests'])) {
                echo 'Rental requests count: ' . count($props['rentalRequests']) . PHP_EOL;
            }
            
            if (isset($props['stats'])) {
                echo 'Stats: ' . json_encode($props['stats']) . PHP_EOL;
            }
        }
        
    } catch (\Exception $e) {
        echo 'Error: ' . $e->getMessage() . PHP_EOL;
        echo 'File: ' . $e->getFile() . ':' . $e->getLine() . PHP_EOL;
    }
    
} else {
    echo 'Test user not found' . PHP_EOL;
}
