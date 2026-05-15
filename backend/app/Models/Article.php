<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

use App\Traits\HasSlug;

class Article extends Model
{
    use HasSlug;

    protected static function booted()
    {
        static::saving(function ($article) {
            if (empty($article->slug) || $article->isDirty('title')) {
                $titleEn = $article->title['en'] ?? '';
                if ($titleEn) {
                    $baseSlug = Str::slug($titleEn);
                    $slug = $baseSlug;
                    $count = 1;
                    while (static::where('slug', $slug)->where('id', '!=', $article->id)->exists()) {
                        $slug = $baseSlug . '-' . $count++;
                    }
                    $article->slug = $slug;
                }
            }
        });
    }

    protected $fillable = [
        'slug',
        'title',
        'category',
        'treatment_id',
        'image_id',
        'excerpt',
        'content',
        'author',
        'read_time',
        'is_active'
    ];

    protected $casts = [
        'title' => 'array',
        'category' => 'array',
        'treatment_id' => 'integer',
        'excerpt' => 'array',
        'content' => 'array',
        'author' => 'array',
        'read_time' => 'array',
        'is_active' => 'boolean'
    ];

    protected $with = ['treatment'];
    protected $appends = ['media_url'];

    public function treatment()
    {
        return $this->belongsTo(Treatment::class);
    }

    public function image()
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function getMediaUrlAttribute()
    {
        return $this->image ? $this->image->full_url : null;
    }
}
