<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Check the latest rental request
$latestRental = \App\Models\RentalRequest::orderBy('id', 'desc')->first();

if ($latestRental) {
    echo "=== Latest Rental Request (ID: " . $latestRental->id . ") ===\n";
    echo "Street Address: " . ($latestRental->address ?? 'NULL') . "\n";
    echo "Barangay: " . ($latestRental->barangay ?? 'NULL') . "\n";
    echo "City: " . ($latestRental->city ?? 'NULL') . "\n";
    echo "Province: " . ($latestRental->province ?? 'NULL') . "\n";
    echo "Postal Code: " . ($latestRental->postal_code ?? 'NULL') . "\n";
    echo "Delivery Address: " . ($latestRental->delivery_address ?? 'NULL') . "\n";
    echo "Delivery Lat: " . ($latestRental->delivery_lat ?? 'NULL') . "\n";
    echo "Delivery Lng: " . ($latestRental->delivery_lng ?? 'NULL') . "\n";
    
    // Check if barangay fields exist in database
    echo "\n=== Database Schema Check ===\n";
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('rental_requests');
    echo "Columns in rental_requests table:\n";
    foreach ($columns as $column) {
        echo "  - $column\n";
    }
    
    // Check if barangay column exists
    if (in_array('barangay', $columns)) {
        echo "✅ Barangay column exists in database\n";
    } else {
        echo "❌ Barangay column missing from database\n";
    }
    
} else {
    echo "No rental requests found\n";
}
