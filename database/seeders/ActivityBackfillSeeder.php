<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\RentalRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivityBackfillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all rental requests that don't have corresponding activities
        $rentalRequestIds = Activity::pluck('rental_request_id')->toArray();
        
        $rentalRequests = RentalRequest::whereNotIn('id', $rentalRequestIds)
            ->where('status', '!=', 'canceled')
            ->get();

        foreach ($rentalRequests as $rentalRequest) {
            $customer = Customer::find($rentalRequest->customer_id);
            
            if ($customer) {
                // Try to find user by customer name
                $user = User::where('name', $customer->name)->first();
                
                if ($user) {
                    Activity::create([
                        'user_id' => $user->id,
                        'customer_id' => $customer->id,
                        'rental_request_id' => $rentalRequest->id,
                        'action' => 'rental_request',
                        'description' => "User {$user->name} submitted a rental request for {$rentalRequest->tank_type}",
                        'type' => 'info',
                        'created_at' => $rentalRequest->created_at,
                        'updated_at' => $rentalRequest->updated_at,
                    ]);
                }
            }
        }

        $this->command->info('Backfilled ' . count($rentalRequests) . ' rental requests with activity logs.');
    }
}
