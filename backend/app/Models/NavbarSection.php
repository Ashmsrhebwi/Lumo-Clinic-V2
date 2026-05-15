<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavbarSection extends Model
{
    protected $fillable = [
        'label',
        'order',
        'is_footer',
        'is_active',
    ];

    protected $casts = [
        'label' => 'array',
        'is_footer' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(NavbarItem::class)->orderBy('order');
    }
}
