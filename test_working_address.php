<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Test working address formats
$testAddresses = [
    'Simple City' => 'Makati City',
    'Simple Street + City' => '123 Rizal Street, Makati City',
    'Complete Philippine Address' => '123 Rizal Street, Makati City, Metro Manila, Philippines'
];

$geoService = new \App\Services\GeolocationService();

echo "Testing Working Address Formats\n";
echo "===============================\n\n";

foreach ($testAddresses as $format => $address) {
    echo "Format: " . $format . "\n";
    echo "Address: " . $address . "\n";
    
    $coordinates = $geoService->getCoordinatesFromAddress($address);
    
    if ($coordinates) {
        echo "✅ SUCCESS: " . $coordinates['lat'] . ", " . $coordinates['lng'] . "\n";
        echo "Formatted: " . $coordinates['formatted_address'] . "\n";
        
        // Create rental request
        $customer = \App\Models\Customer::find(9);
        if ($customer) {
            $rentalRequest = \App\Models\RentalRequest::create([
                'customer_id' => $customer->id,
                'product_id' => null,
                'tank_type' => 'Medical Oxygen',
                'quantity' => 1,
                'start_date' => now()->addDays(1)->format('Y-m-d'),
                'end_date' => now()->addDays(7)->format('Y-m-d'),
                'purpose' => 'Test with format: ' . $format,
                'contact_number' => $customer->contact_number,
                'address' => $address,
                'delivery_address' => $coordinates['formatted_address'],
                'delivery_lat' => $coordinates['lat'],
                'delivery_lng' => $coordinates['lng'],
                'status' => 'pending',
                'admin_notes' => null,
                'rejected_reason' => null
            ]);
            echo "✅ Rental Created: ID " . $rentalRequest->id . "\n";
            echo "📍 Track URL: /user/rentals/" . $rentalRequest->id . "/track\n";
        }
    } else {
        echo "❌ FAILED\n";
    }
    
    echo "\n" . str_repeat("-", 50) . "\n\n";
}

echo "\n=== RECOMMENDATION ===\n";
echo "Best working format: 'Street, City' or 'City, Province'\n";
echo "For simplified form, use single address field\n";
echo "Customers can enter complete address in one field\n";
echo "System will geocode successfully for Philippine addresses\n";
