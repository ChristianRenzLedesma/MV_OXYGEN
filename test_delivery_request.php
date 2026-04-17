<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Get test customer
$customer = \App\Models\Customer::find(9);

if ($customer) {
    echo "Creating new rental request with delivery address...\n";
    
    // Test different delivery addresses
    $deliveryAddresses = [
        'Makati City, Philippines',
        'Pasig City, Philippines', 
        'Taguig City, Philippines',
        'Mandaluyong City, Philippines'
    ];
    
    foreach ($deliveryAddresses as $address) {
        echo "\n=== Testing Address: " . $address . " ===\n";
        
        // Test geocoding first
        $geoService = new \App\Services\GeolocationService();
        $coordinates = $geoService->getCoordinatesFromAddress($address);
        
        if ($coordinates) {
            echo "✅ Geocoding successful\n";
            echo "Coordinates: " . $coordinates['lat'] . ", " . $coordinates['lng'] . "\n";
            echo "Formatted: " . $coordinates['formatted_address'] . "\n";
            
            // Create rental request
            $rentalRequest = \App\Models\RentalRequest::create([
                'customer_id' => $customer->id,
                'product_id' => null,
                'tank_type' => 'Medical Oxygen',
                'quantity' => 1,
                'start_date' => now()->addDays(1)->format('Y-m-d'),
                'end_date' => now()->addDays(7)->format('Y-m-d'),
                'purpose' => 'Home delivery for medical use - ' . $address,
                'contact_number' => $customer->contact_number,
                'address' => $address,
                'delivery_address' => $coordinates['formatted_address'] ?? $address,
                'delivery_lat' => $coordinates['lat'],
                'delivery_lng' => $coordinates['lng'],
                'status' => 'pending',
                'admin_notes' => null,
                'rejected_reason' => null
            ]);
            
            echo "✅ Rental request created: ID " . $rentalRequest->id . "\n";
            echo "📍 Track URL: /user/rentals/" . $rentalRequest->id . "/track\n";
            
            // Calculate distance from store (Manila)
            $distance = $geoService->calculateDistance(
                14.5995, 120.9842, // Manila store location
                $coordinates['lat'], $coordinates['lng']
            );
            echo "📏 Distance from store: " . round($distance, 2) . " km\n";
            
            $eta = $geoService->getEstimatedDeliveryTime($distance);
            echo "⏱️ Estimated delivery time: " . $eta . " minutes\n";
            
        } else {
            echo "❌ Geocoding failed for: " . $address . "\n";
        }
    }
    
    echo "\n=== Summary ===\n";
    echo "Created " . count($deliveryAddresses) . " test rental requests with delivery addresses\n";
    echo "All requests can be tracked once approved by admin\n";
    echo "Customers will see their home addresses on the tracking map\n";
    
} else {
    echo "Customer not found\n";
}
