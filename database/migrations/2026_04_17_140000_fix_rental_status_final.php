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
        // First, drop the enum column completely
        Schema::table('rental_requests', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Then add it back with the correct enum values
        Schema::table('rental_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed', 'canceled'])
                ->default('pending')
                ->after('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rental_requests', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('rental_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])
                ->default('pending')
                ->after('address');
        });
    }
};
