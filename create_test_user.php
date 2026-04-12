<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use Illuminate\Support\Facades\Hash;

$user = App\Models\User::create([
    'name' => 'Test User',
    'email' => 'testuser@example.com',
    'password' => Hash::make('password'),
    'phone' => '09123456789'
]);

echo 'Created test user: testuser@example.com with password: password';
