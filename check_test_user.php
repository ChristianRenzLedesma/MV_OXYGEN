<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

$user = App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    echo 'Email: ' . $user->email . PHP_EOL;
    echo 'Email verified at: ' . ($user->email_verified_at ? $user->email_verified_at : 'No') . PHP_EOL;
    echo 'Is admin: ' . ($user->isAdmin() ? 'Yes' : 'No') . PHP_EOL;
    echo 'Dashboard route: ' . $user->getDashboardRoute() . PHP_EOL;
    
    // Test password verification
    if (Hash::check('password', $user->password)) {
        echo 'Password verification: OK' . PHP_EOL;
    } else {
        echo 'Password verification: FAILED' . PHP_EOL;
    }
} else {
    echo 'User not found' . PHP_EOL;
}
