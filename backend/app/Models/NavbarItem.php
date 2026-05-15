<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavbarItem extends Model
{
    protected $fillable = [
        'navbar_section_id',
        'treatment_id',
        'custom_url',
        'label',
        'order',
        'open_in_new_tab',
        'is_active',
    ];

    protected $casts = [
        'label' => 'array',
        'open_in_new_tab' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function section()
    {
        return $this->belongsTo(NavbarSection::class, 'navbar_section_id');
    }

    public function treatment()
    {
        return $this->belongsTo(Treatment::class, 'treatment_id');
    }
}
