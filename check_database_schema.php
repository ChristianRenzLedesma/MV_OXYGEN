<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "=== CHECKING DATABASE SCHEMA ===\n\n";

// Check rental_requests table structure
try {
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('rental_requests');
    echo "Columns in rental_requests table:\n";
    foreach ($columns as $column) {
        echo "  - " . $column . "\n";
    }
    
    echo "\n=== CHECKING STATUS COLUMN ===\n";
    
    // Check if status column exists and its type
    $columnType = \Illuminate\Support\Facades\Schema::getColumnType('rental_requests', 'status');
    echo "Status column type: " . $columnType . "\n";
    
    // Check current rental requests and their status values
    $rentals = \App\Models\RentalRequest::limit(5)->get(['id', 'status']);
    echo "\nCurrent rental request statuses:\n";
    foreach ($rentals as $rental) {
        echo "  ID " . $rental->id . ": '" . $rental->status . "' (length: " . strlen($rental->status) . ")\n";
    }
    
    echo "\n=== SOLUTION ===\n";
    echo "The status column appears to have a length limit.\n";
    echo "Need to use shorter status values:\n";
    echo "  - 'pending' (7 chars)\n";
    echo "  - 'approved' (8 chars)\n";
    echo "  - 'rejected' (8 chars)\n";
    echo "  - 'cancelled' (9 chars - TOO LONG!)\n";
    echo "  - 'canceled' (8 chars - BETTER!)\n";
    echo "\nRecommendation: Use 'canceled' instead of 'cancelled'\n";
    
} catch (\Exception $e) {
    echo "Error checking schema: " . $e->getMessage() . "\n";
}
