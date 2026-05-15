<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessStep extends Model
{
    protected static function booted()
    {
        static::creating(function ($step) {
            if (empty($step->icon_name)) {
                $step->icon_name = 'Check';
            }
        });
    }

    protected $fillable = [
        'title',
        'description',
        'icon_name',
        'order',
        'is_active'
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'order' => 'integer',
        'is_active' => 'boolean'
    ];
}
