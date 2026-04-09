<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $primaryKey = 'customer_id';
    
    protected $fillable = [
        'name',
        'contact_number',
        'address',
        'status',
        'total_rentals',
    ];

    protected $casts = [
        'total_rentals' => 'integer',
        'customer_id' => 'integer',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'customer_id', 'customer_id');
    }
}
