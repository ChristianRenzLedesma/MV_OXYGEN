<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GeolocationService
{
    /**
     * Get coordinates from address using OpenStreetMap Nominatim API
     */
    public function getCoordinatesFromAddress(string $address): ?array
    {
        $cacheKey = 'geocode_' . md5($address);
        
        return Cache::remember($cacheKey, 3600, function () use ($address) {
            try {
                $response = Http::get('https://nominatim.openstreetmap.org/search', [
                    'q' => $address,
                    'format' => 'json',
                    'limit' => 1,
                    'countrycodes' => 'ph' // Philippines
                ]);

                if ($response->successful() && $response->json()) {
                    $data = $response->json()[0];
                    return [
                        'lat' => (float) $data['lat'],
                        'lng' => (float) $data['lon'],
                        'formatted_address' => $data['display_name']
                    ];
                }
            } catch (\Exception $e) {
                \Log::error('Geocoding failed: ' . $e->getMessage());
            }

            return null;
        });
    }

    /**
     * Get address from coordinates using reverse geocoding
     */
    public function getAddressFromCoordinates(float $lat, float $lng): ?string
    {
        $cacheKey = 'reverse_geocode_' . md5("{$lat},{$lng}");
        
        return Cache::remember($cacheKey, 3600, function () use ($lat, $lng) {
            try {
                $response = Http::get('https://nominatim.openstreetmap.org/reverse', [
                    'lat' => $lat,
                    'lon' => $lng,
                    'format' => 'json'
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return $data['display_name'] ?? null;
                }
            } catch (\Exception $e) {
                \Log::error('Reverse geocoding failed: ' . $e->getMessage());
            }

            return null;
        });
    }

    /**
     * Calculate distance between two coordinates in kilometers
     */
    public function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $latDiff = deg2rad($lat2 - $lat1);
        $lngDiff = deg2rad($lng2 - $lng1);

        $a = sin($latDiff / 2) * sin($latDiff / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lngDiff / 2) * sin($lngDiff / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Get estimated delivery time based on distance
     */
    public function getEstimatedDeliveryTime(float $distance): int
    {
        // Average speed in city: 30 km/h
        $averageSpeed = 30;
        $baseTime = 30; // 30 minutes base time for preparation
        
        $travelTime = ($distance / $averageSpeed) * 60; // Convert to minutes
        
        return (int) ($baseTime + $travelTime);
    }
}
