<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use Illuminate\Support\Facades\Hash;

// Create admin user
$admin = App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@mvoxygen.com',
    'password' => Hash::make('admin123'),
    'phone' => '09987654321'
]);

// Verify email immediately
$admin->email_verified_at = now();
$admin->save();

echo 'Created admin user:' . PHP_EOL;
echo 'Email: admin@mvoxygen.com' . PHP_EOL;
echo 'Password: admin123' . PHP_EOL;
echo 'Is admin: ' . ($admin->isAdmin() ? 'Yes' : 'No') . PHP_EOL;
echo 'Dashboard route: ' . $admin->getDashboardRoute() . PHP_EOL;
echo 'Email verified: Yes' . PHP_EOL;
