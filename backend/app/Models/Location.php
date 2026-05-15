<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'city',
        'country',
        'address',
        'phone',
        'email',
        'hours',
        'is_active'
    ];

    protected $casts = [
        'city' => 'array',
        'country' => 'array',
        'address' => 'array',
        'hours' => 'array',
        'is_active' => 'boolean'
    ];
}
