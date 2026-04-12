<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

for($i = 1; $i <= 5; $i++) {
    App\Models\RentalRequest::create([
        'customer_id' => 1,
        'product_id' => null,
        'tank_type' => 'Test Tank ' . $i,
        'quantity' => 1,
        'start_date' => now()->addDays($i),
        'end_date' => now()->addDays($i + 7),
        'purpose' => 'Test purpose ' . $i,
        'contact_number' => '0912-345-678' . $i,
        'address' => 'Test Address ' . $i,
        'status' => 'pending',
        'admin_notes' => null,
        'rejected_reason' => null
    ]);
}

echo 'Created 5 test rental requests';
