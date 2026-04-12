<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo 'Testing Inertia component resolution...' . PHP_EOL;

// Test the exact Inertia response that the controller creates
use App\Http\Controllers\UserDashboardController;

// Simulate authentication
$user = \App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    \Illuminate\Support\Facades\Auth::login($user);
    
    $controller = new UserDashboardController();
    $response = $controller->index();
    
    if ($response instanceof \Inertia\Response) {
        echo 'Inertia response created successfully' . PHP_EOL;
        
        // Use reflection to access the component property
        $reflection = new ReflectionClass($response);
        $componentProperty = $reflection->getProperty('component');
        $componentProperty->setAccessible(true);
        
        $component = $componentProperty->getValue($response);
        echo 'Component name: ' . $component . PHP_EOL;
        
        // Check if the component file exists
        $componentPath = __DIR__ . '/resources/js/pages/' . $component . '.tsx';
        echo 'Component path: ' . $componentPath . PHP_EOL;
        echo 'File exists: ' . (file_exists($componentPath) ? 'Yes' : 'No') . PHP_EOL;
        
        if (file_exists($componentPath)) {
            echo 'File size: ' . filesize($componentPath) . ' bytes' . PHP_EOL;
            echo 'File contents preview:' . PHP_EOL;
            echo file_get_contents($componentPath) . PHP_EOL;
        }
    }
} else {
    echo 'Test user not found' . PHP_EOL;
}
