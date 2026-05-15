<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    protected $fillable = [
        'platform',
        'url',
        'icon_name',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];
}
