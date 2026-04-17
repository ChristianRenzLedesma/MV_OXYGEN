<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Check our test rental request
$rental = \App\Models\RentalRequest::find(23);

if ($rental) {
    echo "=== Test Rental Request ===\n";
    echo "ID: " . $rental->id . "\n";
    echo "Tank Type: " . $rental->tank_type . "\n";
    echo "Status: " . $rental->status . "\n";
    echo "Customer ID: " . $rental->customer_id . "\n";
    echo "\n=== Geolocation Data ===\n";
    echo "Delivery Address: " . ($rental->delivery_address ?? 'None') . "\n";
    echo "Delivery Lat: " . ($rental->delivery_lat ?? 'None') . "\n";
    echo "Delivery Lng: " . ($rental->delivery_lng ?? 'None') . "\n";
    echo "Pickup Address: " . ($rental->pickup_address ?? 'None') . "\n";
    echo "Pickup Lat: " . ($rental->pickup_lat ?? 'None') . "\n";
    echo "Pickup Lng: " . ($rental->pickup_lng ?? 'None') . "\n";
    echo "Current Lat: " . ($rental->current_lat ?? 'None') . "\n";
    echo "Current Lng: " . ($rental->current_lng ?? 'None') . "\n";
    
    echo "\n=== Tracking Availability ===\n";
    $isTrackable = in_array($rental->status, ['approved', 'in_transit', 'delivered']);
    echo "Can be tracked: " . ($isTrackable ? 'YES' : 'NO') . "\n";
    echo "Track URL: /user/rentals/" . $rental->id . "/track\n";
    
    // Test geolocation service
    echo "\n=== Testing Geolocation Service ===\n";
    $geoService = new \App\Services\GeolocationService();
    
    if ($rental->delivery_address) {
        $coords = $geoService->getCoordinatesFromAddress($rental->delivery_address);
        if ($coords) {
            echo "Geocoding successful for: " . $rental->delivery_address . "\n";
            echo "Coordinates: " . $coords['lat'] . ", " . $coords['lng'] . "\n";
        } else {
            echo "Geocoding failed for: " . $rental->delivery_address . "\n";
        }
    }
    
} else {
    echo "Rental request not found!\n";
}
