<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'latest'); // 'latest' or 'recent'
        
        $query = Activity::with(['user', 'customer', 'rentalRequest']);
        
        if ($filter === 'latest') {
            $activities = $query->latest()->limit(20)->get();
        } elseif ($filter === 'recent') {
            $activities = $query->recent(24)->latest()->get();
        } else {
            $activities = $query->latest()->limit(20)->get();
        }
        
        return response()->json([
            'activities' => $activities
        ]);
    }
}
