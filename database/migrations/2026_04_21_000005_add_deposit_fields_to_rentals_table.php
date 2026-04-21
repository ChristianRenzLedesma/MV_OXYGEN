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
        Schema::table('rentals', function (Blueprint $table) {
            $table->decimal('deposit_amount', 10, 2)->nullable()->after('total_amount');
            $table->string('deposit_payment_method')->nullable()->after('deposit_amount');
            $table->date('deposit_payment_date')->nullable()->after('deposit_payment_method');
            $table->string('deposit_status')->default('pending')->after('deposit_payment_date');
            $table->string('deposit_reference_number')->nullable()->after('deposit_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropColumn(['deposit_amount', 'deposit_payment_method', 'deposit_payment_date', 'deposit_status', 'deposit_reference_number']);
        });
    }
};
