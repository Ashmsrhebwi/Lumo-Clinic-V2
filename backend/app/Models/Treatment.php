<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

use App\Traits\HasSlug;

class Treatment extends Model
{
    use HasSlug;

    protected $fillable = [
        'slug',
        'category',
        'title',
        'media_id',
        'content_media_id',
        'after_media_id',
        'description',
        'success_rate',
        'duration',
        'features',
        'content_sections',
        'template_type',
        'is_active',
        'order',
    ];

    protected $casts = [
        'category' => 'json',
        'title' => 'json',
        'description' => 'json',
        'duration' => 'json',
        'features' => 'json',
        'content_sections' => 'json',
        'is_active' => 'boolean',
        'success_rate' => 'float'
    ];

    protected $appends = ['image', 'content_media_url', 'beforeAfter', 'media_url'];

    public function media()
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    public function after_media()
    {
        return $this->belongsTo(Media::class, 'after_media_id');
    }

    public function content_media()
    {
        return $this->belongsTo(Media::class, 'content_media_id');
    }

    public function getImageAttribute()
    {
        return $this->media ? $this->media->full_url : null;
    }

    public function getBeforeAfterAttribute()
    {
        return $this->after_media ? $this->after_media->full_url : null;
    }

    public function getContentMediaUrlAttribute()
    {
        return $this->content_media ? $this->content_media->full_url : null;
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function getMediaUrlAttribute()
    {
        return $this->media ? $this->media->full_url : null;
    }
}
