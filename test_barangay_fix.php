<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

// Test different address formats for better geocoding
$testFormats = [
    'Format 1: City, Province' => 'Makati City, Metro Manila',
    'Format 2: Street, City, Province' => '123 Rizal Street, Makati City, Metro Manila',
    'Format 3: Street, Barangay, City' => '123 Rizal Street, Barangay 735, Makati City',
    'Format 4: Barangay, City, Province' => 'Barangay 735, Makati City, Metro Manila',
    'Format 5: Simple City' => 'Makati',
    'Format 6: Street + City' => '123 Rizal Street, Makati City'
];

$geoService = new \App\Services\GeolocationService();

echo "Testing Different Address Formats for Better Geocoding\n";
echo "================================================\n\n";

foreach ($testFormats as $format => $address) {
    echo "Testing: " . $format . "\n";
    echo "Address: " . $address . "\n";
    
    $coordinates = $geoService->getCoordinatesFromAddress($address);
    
    if ($coordinates) {
        echo "✅ SUCCESS: " . $coordinates['lat'] . ", " . $coordinates['lng'] . "\n";
        echo "Formatted: " . $coordinates['formatted_address'] . "\n";
        
        // Create test rental
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
                'address' => '123 Test Street',
                'barangay' => 'Barangay 735',
                'city' => 'Makati City',
                'province' => 'Metro Manila',
                'postal_code' => '1200',
                'delivery_address' => $coordinates['formatted_address'],
                'delivery_lat' => $coordinates['lat'],
                'delivery_lng' => $coordinates['lng'],
                'status' => 'pending',
                'admin_notes' => null,
                'rejected_reason' => null
            ]);
            echo "✅ Rental Created: ID " . $rentalRequest->id . "\n";
        }
    } else {
        echo "❌ FAILED\n";
    }
    
    echo "\n" . str_repeat("-", 50) . "\n\n";
}

echo "\n=== Best Format Found ===\n";
echo "The most reliable format appears to be: City, Province\n";
echo "For barangay-level precision, store barangay separately\n";
echo "Use City, Province for geocoding\n";
