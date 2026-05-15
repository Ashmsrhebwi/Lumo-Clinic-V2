<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'treatment_id',
        'patient_name',
        'feedback',
        'rating',
        'is_active',
    ];

    protected $casts = [
        'patient_name' => 'array',
        'feedback' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = ['treatment_name'];

    public function treatment()
    {
        return $this->belongsTo(Treatment::class);
    }

    public function getTreatmentNameAttribute()
    {
        return $this->treatment ? $this->treatment->title : null;
    }
}
