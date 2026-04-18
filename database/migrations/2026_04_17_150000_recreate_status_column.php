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
            $table->string('status_temp')->nullable();
        });

        // Copy data to temp column
        \Illuminate\Support\Facades\DB::table('rental_requests')
            ->update(['status_temp' => \Illuminate\Support\Facades\DB::raw('status')]);

        // Drop the original enum column
        Schema::table('rental_requests', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Recreate the enum column with correct values
        Schema::table('rental_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed', 'canceled'])
                ->default('pending')
                ->after('address');
        });

        // Copy data back from temp column
        \Illuminate\Support\Facades\DB::table('rental_requests')
            ->whereNotNull('status_temp')
            ->update(['status' => \Illuminate\Support\Facades\DB::raw('status_temp')]);

        // Drop the temp column
        Schema::table('rental_requests', function (Blueprint $table) {
            $table->dropColumn('status_temp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rental_requests', function (Blueprint $table) {
            $table->dropColumn('status_temp');
        });
    }
};
