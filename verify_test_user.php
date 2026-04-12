<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

$user = App\Models\User::where('email', 'testuser@example.com')->first();

if ($user) {
    $user->email_verified_at = now();
    $user->save();
    
    echo 'User email verified successfully!' . PHP_EOL;
    echo 'Email: ' . $user->email . PHP_EOL;
    echo 'Email verified at: ' . $user->email_verified_at . PHP_EOL;
    echo 'Dashboard route: ' . $user->getDashboardRoute() . PHP_EOL;
    echo 'You can now login with: testuser@example.com / password' . PHP_EOL;
} else {
    echo 'User not found' . PHP_EOL;
}
