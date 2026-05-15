<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'name',
        'specialty',
        'image_id',
        'rating',
        'experience',
        'patients',
        'languages',
        'bio',
        'specialties',
        'is_active'
    ];

    protected $casts = [
        'specialty' => 'array',
        'languages' => 'array',
        'bio' => 'array',
        'specialties' => 'array',
        'is_active' => 'boolean',
        'rating' => 'float'
    ];

    protected $appends = ['media_url'];

    public function image()
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function getMediaUrlAttribute()
    {
        return $this->image ? $this->image->full_url : null;
    }
}
