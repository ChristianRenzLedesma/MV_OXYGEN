<?php

namespace App\Http\Controllers;

use App\Models\Tank;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    /**
     * Display a listing of the inventory.
     */
    public function index(): Response
    {
        $tanks = Tank::orderBy('tank_type')->get();
        $maintenances = Maintenance::orderBy('created_at', 'desc')->get();

        return Inertia::render('inventory/index', [
            'products' => $tanks,
            'maintenances' => $maintenances,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    /**
     * Store a newly created tank in inventory.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tank_type' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'last_refilled' => 'nullable|date',
            'status' => 'required|string|in:available,rented_out,maintenance',
        ]);

        Tank::create([
            'tank_type' => $request->tank_type,
            'quantity' => $request->quantity,
            'last_refilled' => $request->last_refilled,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Tank added successfully!');
    }

    /**
     * Store a new maintenance record.
     */
    public function storeMaintenance(Request $request)
    {
        $request->validate([
            'tank_type' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'condition' => 'required|string',
            'valve' => 'required|string',
        ]);

        // Check if tank exists in inventory
        $tank = Tank::where('tank_type', $request->tank_type)->first();

        if (!$tank) {
            return redirect()->back()->withErrors(['tank_type' => 'Tank must be added to inventory first before adding to maintenance.']);
        }

        // Check if tank has sufficient quantity
        if ($tank->quantity < $request->quantity) {
            return redirect()->back()->withErrors(['quantity' => 'Insufficient quantity in inventory. Available: ' . $tank->quantity]);
        }

        // Create maintenance record
        Maintenance::create([
            'tank_type' => $request->tank_type,
            'quantity' => $request->quantity,
            'condition' => $request->condition,
            'valve' => $request->valve,
        ]);

        // Reduce tank quantity
        $tank->quantity -= $request->quantity;
        $tank->save();

        return redirect()->back()->with('success', 'Maintenance record added successfully and tank quantity reduced.');
    }
}
