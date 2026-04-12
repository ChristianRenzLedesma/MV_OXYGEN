<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RentalRequest;
use App\Models\Rental;

class ApproveRentalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the rental request
        $rentalRequest = RentalRequest::find(17);
        
        if ($rentalRequest) {
            // Approve the rental request
            $rentalRequest->update(['status' => 'approved']);
            
            // Create rental record with correct end date
            $rental = Rental::create([
                'rental_request_id' => $rentalRequest->id,
                'customer_id' => $rentalRequest->customer_id,
                'product_id' => $rentalRequest->product_id,
                'start_date' => $rentalRequest->start_date,
                'end_date' => $rentalRequest->end_date, // Use rental request end date
                'status' => 'active',
                'pickup_date' => now(),
            ]);
            
            $this->command->info('Rental request approved and rental record created');
            $this->command->info('Rental end date: ' . $rental->end_date);
            $this->command->info('Rental record end date: ' . $rental->end_date);
        } else {
            $this->command->error('Rental request not found');
        }
    }
}
