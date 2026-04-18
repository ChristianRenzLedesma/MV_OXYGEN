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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('rental_request_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action'); // e.g., 'rental_request', 'rental_approved', 'rental_rejected', etc.
            $table->text('description')->nullable();
            $table->string('type')->default('info'); // info, success, warning, error
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('customer_id');
            $table->index('rental_request_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
