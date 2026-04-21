<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'plant_name',
        'address',
        'contact_person',
        'contact_number',
        'email',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
