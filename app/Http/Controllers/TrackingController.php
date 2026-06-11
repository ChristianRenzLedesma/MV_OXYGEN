<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\RentalRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function show(Request $request, string $trackingNumber)
    {
        $rentalRequest = RentalRequest::where('tracking_number', $trackingNumber)->first();

        if ($request->query('json')) {
            return $this->jsonResponse($rentalRequest, $trackingNumber);
        }

        if (!$rentalRequest) {
            return Inertia::render('track-result', [
                'not_found' => true,
                'tracking_number' => $trackingNumber,
            ]);
        }

        $activities = Activity::where('rental_request_id', $rentalRequest->id)
            ->orderBy('created_at', 'asc')
            ->get(['action', 'description', 'created_at']);

        $rentalData = $this->buildRentalData($rentalRequest, $activities);

        return Inertia::render('track-result', [
            'rental' => $rentalData,
            'not_found' => false,
            'tracking_number' => $trackingNumber,
        ]);
    }

    public function lookup(Request $request)
    {
        $trackingNumber = $request->query('q');
        if (!$trackingNumber) {
            return response()->json(['not_found' => true, 'message' => 'No tracking number provided.']);
        }

        $rentalRequest = RentalRequest::where('tracking_number', $trackingNumber)->first();
        return $this->jsonResponse($rentalRequest, $trackingNumber);
    }

    private function jsonResponse($rentalRequest, string $trackingNumber)
    {
        if (!$rentalRequest) {
            return response()->json([
                'not_found' => true,
                'tracking_number' => $trackingNumber,
            ]);
        }

        $activities = Activity::where('rental_request_id', $rentalRequest->id)
            ->orderBy('created_at', 'asc')
            ->get(['action', 'description', 'created_at']);

        return response()->json([
            'rental' => $this->buildRentalData($rentalRequest, $activities),
            'not_found' => false,
            'tracking_number' => $trackingNumber,
        ]);
    }

    private function buildRentalData($rentalRequest, $activities): array
    {
        $rentalData = [
            'id' => $rentalRequest->id,
            'tracking_number' => $rentalRequest->tracking_number,
            'tank_type' => $rentalRequest->tank_type,
            'status' => $rentalRequest->status,
            'pickup_type' => $rentalRequest->delivery_address ? 'delivery' : 'pickup',
            'created_at' => $rentalRequest->created_at,
            'activities' => $activities,
        ];

        if ($rentalRequest->delivery_address) {
            $rentalData['delivery_location'] = [
                'lat' => $rentalRequest->delivery_lat,
                'lng' => $rentalRequest->delivery_lng,
                'address' => $rentalRequest->delivery_address,
            ];
        }

        if ($rentalRequest->pickup_address) {
            $rentalData['pickup_location'] = [
                'lat' => $rentalRequest->pickup_lat,
                'lng' => $rentalRequest->pickup_lng,
                'address' => $rentalRequest->pickup_address,
            ];
        }

        return $rentalData;
    }
}
