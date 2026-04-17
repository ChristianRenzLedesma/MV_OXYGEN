<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Test complete Philippine addresses with barangay
$testAddresses = [
    [
        'street' => '123 Rizal Street',
        'barangay' => 'Barangay 735',
        'city' => 'Makati City',
        'province' => 'Metro Manila',
        'postal_code' => '1200'
    ],
    [
        'street' => '456 Shaw Boulevard',
        'barangay' => 'Barangay Wack Wack Greenhills',
        'city' => 'Mandaluyong City',
        'province' => 'Metro Manila',
        'postal_code' => '1550'
    ],
    [
        'street' => '789 Cainta Road',
        'barangay' => 'Barangay San Isidro',
        'city' => 'Cainta',
        'province' => 'Rizal',
        'postal_code' => '1900'
    ],
    [
        'street' => '321 Aguinaldo Highway',
        'barangay' => 'Barangay Dasmariñas',
        'city' => 'Dasmariñas',
        'province' => 'Cavite',
        'postal_code' => '4114'
    ]
];

$customer = \App\Models\Customer::find(9);

if ($customer) {
    echo "Testing Barangay Functionality with Complete Philippine Addresses\n";
    echo "========================================================\n\n";
    
    $geoService = new \App\Services\GeolocationService();
    
    foreach ($testAddresses as $index => $addressData) {
        echo "Test " . ($index + 1) . ": " . $addressData['street'] . "\n";
        echo "Barangay: " . $addressData['barangay'] . "\n";
        echo "City: " . $addressData['city'] . "\n";
        echo "Province: " . $addressData['province'] . "\n";
        echo "Postal Code: " . $addressData['postal_code'] . "\n\n";
        
        // Build complete address
        $fullAddress = $addressData['street'] . ', ' . 
                       $addressData['barangay'] . ', ' . 
                       $addressData['city'] . ', ' . 
                       $addressData['province'] . ', ' . 
                       $addressData['postal_code'] . ', Philippines';
        
        echo "Complete Address: " . $fullAddress . "\n";
        
        // Test geocoding
        $coordinates = $geoService->getCoordinatesFromAddress($fullAddress);
        
        if ($coordinates) {
            echo "✅ Geocoding SUCCESSFUL!\n";
            echo "   Coordinates: " . $coordinates['lat'] . ", " . $coordinates['lng'] . "\n";
            echo "   Formatted: " . $coordinates['formatted_address'] . "\n";
            
            // Create rental request
            $rentalRequest = \App\Models\RentalRequest::create([
                'customer_id' => $customer->id,
                'product_id' => null,
                'tank_type' => 'Medical Oxygen',
                'quantity' => 1,
                'start_date' => now()->addDays(1)->format('Y-m-d'),
                'end_date' => now()->addDays(7)->format('Y-m-d'),
                'purpose' => 'Home delivery with barangay - ' . $addressData['barangay'],
                'contact_number' => $customer->contact_number,
                'address' => $addressData['street'],
                'barangay' => $addressData['barangay'],
                'city' => $addressData['city'],
                'province' => $addressData['province'],
                'postal_code' => $addressData['postal_code'],
                'delivery_address' => $coordinates['formatted_address'] ?? $fullAddress,
                'delivery_lat' => $coordinates['lat'],
                'delivery_lng' => $coordinates['lng'],
                'status' => 'pending',
                'admin_notes' => null,
                'rejected_reason' => null
            ]);
            
            echo "✅ Rental Request Created: ID " . $rentalRequest->id . "\n";
            echo "📍 Track URL: /user/rentals/" . $rentalRequest->id . "/track\n";
            
            // Calculate distance from store
            $distance = $geoService->calculateDistance(
                14.5995, 120.9842, // Manila store location
                $coordinates['lat'], $coordinates['lng']
            );
            echo "📏 Distance from store: " . round($distance, 2) . " km\n";
            
            $eta = $geoService->getEstimatedDeliveryTime($distance);
            echo "⏱️ Estimated delivery time: " . $eta . " minutes\n";
            
        } else {
            echo "❌ Geocoding FAILED\n";
        }
        
        echo "\n" . str_repeat("-", 60) . "\n\n";
    }
    
    echo "=== SUMMARY ===\n";
    echo "Tested " . count($testAddresses) . " complete Philippine addresses with barangay\n";
    echo "All addresses include: Street, Barangay, City, Province, Postal Code\n";
    echo "Customers can now specify their exact barangay for precise delivery!\n";
    
} else {
    echo "Customer not found\n";
}
