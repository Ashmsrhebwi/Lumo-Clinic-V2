<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = [
        'filename',
        'path',
        'mime_type',
        'size',
        'alt_text',
    ];

    protected $casts = [
        'alt_text' => 'array',
    ];

    protected $appends = ['full_url'];

    public function getFullUrlAttribute(): string
    {
        return url('storage/' . $this->path);
    }
}
