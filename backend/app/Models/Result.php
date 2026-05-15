<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $fillable = [
        'treatment_id',
        'before_media_id',
        'after_media_id',
        'patient_name',
        'story',
        'is_active',
    ];

    protected $casts = [
        'patient_name' => 'array',
        'story' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = ['before_image_url', 'after_image_url'];

    public function treatment()
    {
        return $this->belongsTo(Treatment::class);
    }

    public function beforeMedia()
    {
        return $this->belongsTo(Media::class, 'before_media_id');
    }

    public function afterMedia()
    {
        return $this->belongsTo(Media::class, 'after_media_id');
    }

    public function getBeforeImageUrlAttribute()
    {
        return $this->beforeMedia ? $this->beforeMedia->full_url : null;
    }

    public function getAfterImageUrlAttribute()
    {
        return $this->afterMedia ? $this->afterMedia->full_url : null;
    }
}
