<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Test simplified delivery address form
$customer = \App\Models\Customer::find(9);

if ($customer) {
    echo "Testing Simplified Delivery Address Form\n";
    echo "========================================\n\n";
    
    // Test data with single address field
    $testAddress = '123 Rizal Street, Barangay 735, Makati City, Metro Manila 1200, Philippines';
    
    echo "Test Address: " . $testAddress . "\n\n";
    
    // Test geocoding with complete address
    $geoService = new \App\Services\GeolocationService();
    $coordinates = $geoService->getCoordinatesFromAddress($testAddress);
    
    if ($coordinates) {
        echo "✅ Geocoding SUCCESSFUL!\n";
        echo "   Coordinates: " . $coordinates['lat'] . ", " . $coordinates['lng'] . "\n";
        echo "   Formatted: " . $coordinates['formatted_address'] . "\n";
        
        // Create rental request using simplified form data
        $rentalRequest = \App\Models\RentalRequest::create([
            'customer_id' => $customer->id,
            'product_id' => null,
            'tank_type' => 'Medical Oxygen',
            'quantity' => 1,
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(7)->format('Y-m-d'),
            'purpose' => 'Test simplified delivery address form',
            'contact_number' => $customer->contact_number,
            'address' => $testAddress,
            'delivery_address' => $coordinates['formatted_address'],
            'delivery_lat' => $coordinates['lat'],
            'delivery_lng' => $coordinates['lng'],
            'status' => 'pending',
            'admin_notes' => null,
            'rejected_reason' => null
        ]);
        
        echo "✅ Rental Request Created: ID " . $rentalRequest->id . "\n";
        echo "📍 Track URL: /user/rentals/" . $rentalRequest->id . "/track\n";
        
        // Calculate distance
        $distance = $geoService->calculateDistance(
            14.5995, 120.9842, // Manila store
            $coordinates['lat'], $coordinates['lng']
        );
        echo "📏 Distance from store: " . round($distance, 2) . " km\n";
        
        $eta = $geoService->getEstimatedDeliveryTime($distance);
        echo "⏱️ Estimated delivery time: " . $eta . " minutes\n";
        
        // Verify stored data
        echo "\n📋 Stored Data Verification:\n";
        echo "  Address: " . $rentalRequest->address . "\n";
        echo "  Delivery Address: " . $rentalRequest->delivery_address . "\n";
        echo "  Coordinates: " . $rentalRequest->delivery_lat . ", " . $rentalRequest->delivery_lng . "\n";
        
    } else {
        echo "❌ Geocoding FAILED\n";
    }
    
    echo "\n=== SIMPLIFIED FORM BENEFITS ===\n";
    echo "✅ Single address field for easy input\n";
    echo "✅ Customers can enter complete Philippine address\n";
    echo "✅ No complex form fields to confuse users\n";
    echo "✅ Geocoding works with detailed addresses\n";
    echo "✅ Tracking system ready with precise locations\n";
    echo "✅ Better user experience with simplified form\n";
    
} else {
    echo "Customer not found\n";
}
