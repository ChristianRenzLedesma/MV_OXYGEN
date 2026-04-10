<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'customer_id',
        'tank_id',
        'transaction_type',
        'transaction_date',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'customer_id' => 'integer',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }
}
