<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::orderBy('created_at', 'desc')->get();
        
        // Get all recent transactions (last 3 per customer)
        $allRecentTransactions = [];
        $customers->each(function ($customer) use (&$allRecentTransactions) {
            $recentTransactions = $customer->transactions()
                ->orderBy('transaction_date', 'desc')
                ->take(3)
                ->get();
            
            foreach ($recentTransactions as $transaction) {
                $allRecentTransactions[] = [
                    'id' => $transaction->id,
                    'customer_id' => $customer->customer_id,
                    'customer_name' => $customer->name,
                    'tank_id' => $transaction->tank_id,
                    'transaction_type' => $transaction->transaction_type,
                    'transaction_date' => $transaction->transaction_date,
                    'created_at' => $transaction->created_at,
                ];
            }
        });
        
        // Sort all recent transactions by date (most recent first)
        usort($allRecentTransactions, function ($a, $b) {
            return strcmp($b['transaction_date'], $a['transaction_date']);
        });
        
        return Inertia::render('customer', [
            'customers' => $customers,
            'recent_transactions' => $allRecentTransactions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Remove all format requirements
        $data = $request->all();

        try {
            // Simple customer creation without format requirements
            $customer = Customer::create([
                'name' => $data['name'] ?? '',
                'contact_number' => $data['contact_number'] ?? '',
                'address' => $data['address'] ?? '',
                'status' => $data['status'] ?? 'active',
                'total_rentals' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Get updated customer list
            $customers = Customer::orderBy('created_at', 'desc')->get();
            
            // Get all recent transactions (last 3 per customer)
            $allRecentTransactions = [];
            $customers->each(function ($customer) use (&$allRecentTransactions) {
                $recentTransactions = $customer->transactions()
                    ->orderBy('transaction_date', 'desc')
                    ->take(3)
                    ->get();
                
                foreach ($recentTransactions as $transaction) {
                    $allRecentTransactions[] = [
                        'id' => $transaction->id,
                        'customer_id' => $customer->customer_id,
                        'customer_name' => $customer->name,
                        'tank_id' => $transaction->tank_id,
                        'transaction_type' => $transaction->transaction_type,
                        'transaction_date' => $transaction->transaction_date,
                        'created_at' => $transaction->created_at,
                    ];
                }
            });
            
            // Sort all recent transactions by date (most recent first)
            usort($allRecentTransactions, function ($a, $b) {
                return strcmp($b['transaction_date'], $a['transaction_date']);
            });
            
            return Inertia::render('customer', [
                'customers' => $customers,
                'recent_transactions' => $allRecentTransactions,
                'success' => 'Customer successfully added!'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create customer. Please try again.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::with('transactions')->findOrFail($id);
        
        return Inertia::render('customer-show', [
            'customer' => $customer
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $customer = Customer::findOrFail($id);
        return response()->json($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_number' => [
                'required',
                'string',
                'regex:/^09\d{2}-\d{3}-\d{4}$/',
                'min:11',
            ],
            'address' => 'required|string|max:500',
            'status' => 'required|in:active,inactive',
        ], [
            'contact_number.required' => 'Contact number is required.',
            'contact_number.regex' => 'Contact number must be in format: 09XX-XXX-XXXX',
            'contact_number.min' => 'Contact number is too short. Must be exactly 11 characters (09XX-XXX-XXXX).',
        ]);

        try {
            $customer->update($validated);
            
            // Get updated customer list
            $customers = Customer::orderBy('created_at', 'desc')->get();
            $customers->each(function ($customer) {
                $customer->recent_transactions = $customer->transactions()
                    ->orderBy('transaction_date', 'desc')
                    ->take(3)
                    ->get();
            });
            
            return Inertia::render('customer', [
                'customers' => $customers,
                'success' => 'Customer successfully updated!'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update customer. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::findOrFail($id);
        
        try {
            $customer->delete();
            
            // Get updated customer list
            $customers = Customer::orderBy('created_at', 'desc')->get();
            $customers->each(function ($customer) {
                $customer->recent_transactions = $customer->transactions()
                    ->orderBy('transaction_date', 'desc')
                    ->take(3)
                    ->get();
            });
            
            return Inertia::render('customer', [
                'customers' => $customers,
                'success' => 'Customer successfully deleted!'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Failed to delete customer. Please try again.']);
        }
    }
}
