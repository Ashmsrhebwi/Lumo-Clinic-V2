<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stat extends Model
{
    protected $fillable = [
        'label',
        'value',
        'suffix',
        'is_active'
    ];

    protected $casts = [
        'label' => 'array',
        'value' => 'integer',
        'is_active' => 'boolean'
    ];
}
