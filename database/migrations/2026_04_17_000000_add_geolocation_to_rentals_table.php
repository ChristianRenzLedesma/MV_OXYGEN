<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rental_requests', function (Blueprint $table) {
            // Delivery location coordinates
            $table->decimal('delivery_lat', 10, 8)->nullable()->after('status');
            $table->decimal('delivery_lng', 11, 8)->nullable()->after('delivery_lat');
            $table->text('delivery_address')->nullable()->after('delivery_lng');
            
            // Pickup location coordinates
            $table->decimal('pickup_lat', 10, 8)->nullable()->after('delivery_address');
            $table->decimal('pickup_lng', 11, 8)->nullable()->after('pickup_lat');
            $table->text('pickup_address')->nullable()->after('pickup_lng');
            
            // Current location for tracking
            $table->decimal('current_lat', 10, 8)->nullable()->after('pickup_address');
            $table->decimal('current_lng', 11, 8)->nullable()->after('current_lat');
            $table->timestamp('location_updated_at')->nullable()->after('current_lng');
            
            // Indexes for better performance
            $table->index(['delivery_lat', 'delivery_lng']);
            $table->index(['pickup_lat', 'pickup_lng']);
            $table->index(['current_lat', 'current_lng']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rental_requests', function (Blueprint $table) {
            $table->dropIndex(['delivery_lat', 'delivery_lng']);
            $table->dropIndex(['pickup_lat', 'pickup_lng']);
            $table->dropIndex(['current_lat', 'current_lng']);
            
            $table->dropColumn([
                'delivery_lat',
                'delivery_lng', 
                'delivery_address',
                'pickup_lat',
                'pickup_lng',
                'pickup_address',
                'current_lat',
                'current_lng',
                'location_updated_at'
            ]);
        });
    }
};
