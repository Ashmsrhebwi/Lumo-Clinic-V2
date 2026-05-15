<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    protected static function bootHasSlug()
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = $model->generateUniqueSlug();
            }
        });

        static::updating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = $model->generateUniqueSlug();
            }
        });
    }

    public function generateUniqueSlug(): string
    {
        $title = $this->getSlugSource();
        $slug = Str::slug($title);

        if (empty($slug)) {
            $slug = Str::lower(class_basename($this)) . '-' . rand(1000, 9999);
        }

        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }

    protected function getSlugSource(): string
    {
        // Try to get from title.en first (assuming $title is a casted array)
        if (isset($this->title) && is_array($this->title) && !empty($this->title['en'])) {
            return $this->title['en'];
        }

        // Fallback for testimonials or other models that might have a different name field
        if (isset($this->name) && is_string($this->name)) {
            return $this->name;
        }

        return '';
    }
}
