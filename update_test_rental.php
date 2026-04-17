<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Update test rental with geolocation data
$rental = \App\Models\RentalRequest::find(23);

if ($rental) {
    $rental->delivery_address = 'Quezon City, Philippines';
    $rental->delivery_lat = 14.6760;
    $rental->delivery_lng = 121.0437;
    $rental->save();
    echo 'Updated rental with geolocation data' . PHP_EOL;
    
    // Test geolocation service
    echo PHP_EOL . 'Testing Geolocation Service:' . PHP_EOL;
    $geoService = new \App\Services\GeolocationService();
    
    $coords = $geoService->getCoordinatesFromAddress('Quezon City, Philippines');
    if ($coords) {
        echo 'Geocoding successful for: Quezon City, Philippines' . PHP_EOL;
        echo 'Coordinates: ' . $coords['lat'] . ', ' . $coords['lng'] . PHP_EOL;
        echo 'Formatted address: ' . $coords['formatted_address'] . PHP_EOL;
    } else {
        echo 'Geocoding failed' . PHP_EOL;
    }
    
    // Check distance calculation
    if ($coords) {
        $distance = $geoService->calculateDistance(
            14.5995, 120.9842, // Manila
            $coords['lat'], $coords['lng'] // Quezon City
        );
        echo 'Distance from Manila: ' . round($distance, 2) . ' km' . PHP_EOL;
        
        $eta = $geoService->getEstimatedDeliveryTime($distance);
        echo 'Estimated delivery time: ' . $eta . ' minutes' . PHP_EOL;
    }
    
} else {
    echo 'Rental not found' . PHP_EOL;
}
