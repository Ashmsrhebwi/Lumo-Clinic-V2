<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\NavbarSection;
use App\Models\Treatment;
use App\Models\Testimonial;
use App\Models\Stat;
use App\Models\ProcessStep;
use App\Models\SocialLink;
use App\Models\Faq;
use App\Models\Location;
use App\Models\Article;
use App\Models\Doctor;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class InitController extends Controller
{
    /**
     * Aggregated Initializer for Frontend Hydration
     * 
     * Returns all data needed for the first render in a single request.
     * Uses Redis caching for 5 minutes to reduce database load.
     */
    public function initFull()
    {
        $cacheKey = 'init_full_v2';
        
        $data = Cache::remember($cacheKey, 300, function () {
            // 1. Settings & Branding (cached separately for longer)
            $settings = Cache::remember('settings_raw', 600, function () {
                $settingsRaw = Setting::pluck('value', 'key');
                return $settingsRaw->map(function ($value, $key) {
                    if ($key === 'branding' && isset($value['name']) && is_string($value['name'])) {
                        $value['name'] = ['en' => $value['name'], 'ar' => $value['name'], 'fr' => $value['name'], 'ru' => $value['name']];
                    }
                    return $this->resolveMedia($value);
                });
            });

            // 2. Navigation (cached separately)
            $navLinks = Cache::remember('nav_links', 600, function () {
                return NavbarSection::where('is_active', true)
                    ->with(['items' => fn($q) => $q->where('is_active', true)->with('treatment:id,slug')->orderBy('order')])
                    ->orderBy('order')
                    ->get()
                    ->map(fn($s) => [
                        'id' => $s->id, 'label' => $s->label, 'is_footer' => $s->is_footer, 'path' => $s->is_footer ? '#' : null,
                        'children' => $s->items->map(fn($i) => [
                            'id' => $i->id, 'label' => $i->label, 'path' => $i->treatment ? "/treatment/{$i->treatment->slug}" : ($i->custom_url ?: '#'),
                            'open_in_new_tab' => $i->open_in_new_tab,
                        ])
                    ]);
            });

            // 3. Treatments - Only essential fields for listing
            $treatments = Cache::remember('treatments_list', 300, function () {
                return Treatment::where('is_active', true)
                    ->select('id', 'slug', 'category', 'title', 'media_id', 'description', 'features', 'success_rate', 'duration', 'template_type', 'order')
                    ->with('media:id,path')
                    ->orderBy('order')
                    ->limit(12)
                    ->get()
                    ->map(fn($t) => [
                        'id' => $t->id, 
                        'slug' => $t->slug, 
                        'category' => $t->category, 
                        'title' => $t->title,
                        'image' => $t->media ? $t->media->full_url : null,
                        'media_url' => $t->media ? $t->media->full_url : null,
                        'description' => $t->description, 
                        'features' => $t->features, 
                        'successRate' => $t->success_rate,
                        'duration' => $t->duration, 
                        'template_type' => $t->template_type,
                    ]);
            });

            // 4. Secondary Content - All cached separately
            $testimonials = Cache::remember('testimonials_list', 300, function () {
                return Testimonial::where('is_active', true)
                    ->select('id', 'patient_name', 'feedback', 'rating', 'treatment_id')
                    ->with('treatment:id,slug')
                    ->latest()
                    ->limit(6)
                    ->get()
                    ->map(fn($t) => [
                        'id' => $t->id,
                        'patient_name' => $t->patient_name,
                        'feedback' => $t->feedback,
                        'rating' => $t->rating,
                        'treatment_slug' => $t->treatment ? $t->treatment->slug : null,
                    ]);
            });

            $results = Cache::remember('results_list', 300, function () {
                return Result::where('is_active', true)
                    ->select('id', 'patient_name', 'story', 'before_media_id', 'after_media_id', 'treatment_id')
                    ->with(['beforeMedia:id,path', 'afterMedia:id,path', 'treatment:id,slug'])
                    ->latest()
                    ->limit(6)
                    ->get()
                    ->map(fn($r) => [
                        'id' => $r->id,
                        'patient_name' => $r->patient_name,
                        'story' => $r->story,
                        'before_image_url' => $r->beforeMedia ? $r->beforeMedia->full_url : null,
                        'after_image_url' => $r->afterMedia ? $r->afterMedia->full_url : null,
                        'treatment_slug' => $r->treatment ? $r->treatment->slug : null,
                    ]);
            });

            $stats = Cache::remember('stats_list', 600, function () {
                return Stat::select('id', 'label', 'value', 'suffix')->limit(6)->get();
            });

            $faqs = Cache::remember('faqs_list', 600, function () {
                return Faq::select('id', 'question', 'answer')->limit(8)->get();
            });

            $locations = Cache::remember('locations_list', 600, function () {
                return Location::where('is_active', true)
                    ->select('id', 'city', 'country', 'address', 'phone', 'email', 'hours')
                    ->limit(5)
                    ->get();
            });

            $blogs = Cache::remember('blogs_list', 300, function () {
                return Article::where('is_active', true)
                    ->select('id', 'slug', 'title', 'category', 'treatment_id', 'excerpt', 'author', 'read_time', 'image_id')
                    ->with(['image:id,path', 'treatment:id,slug'])
                    ->latest()
                    ->limit(6)
                    ->get()
                    ->map(fn($b) => [
                        'id' => $b->id, 'slug' => $b->slug, 'title' => $b->title, 'category' => $b->category, 
                        'treatment_slug' => $b->treatment ? $b->treatment->slug : null,
                        'excerpt' => $b->excerpt, 'author' => $b->author, 
                        'read_time' => $b->read_time, 'media_url' => $b->image ? $b->image->full_url : null,
                    ]);
            });

            $doctors = Cache::remember('doctors_list', 600, function () {
                return Doctor::where('is_active', true)
                    ->select('id', 'name', 'specialty', 'image_id')
                    ->with('image:id,path')
                    ->limit(8)
                    ->get();
            });

            $socialLinks = Cache::remember('social_links', 600, function () {
                return SocialLink::select('id', 'platform', 'url', 'icon_name', 'is_active')->get();
            });

            $processSteps = Cache::remember('process_steps', 600, function () {
                return ProcessStep::where('is_active', true)
                    ->select('id', 'title', 'description', 'icon_name', 'order')
                    ->orderBy('order')
                    ->get();
            });

            return [
                'settings' => $settings,
                'navLinks' => $navLinks,
                'treatments' => $treatments,
                'testimonials' => $testimonials,
                'results' => $results,
                'stats' => $stats,
                'faqs' => $faqs,
                'locations' => $locations,
                'blogs' => $blogs,
                'doctors' => $doctors,
                'socialLinks' => $socialLinks,
                'processSteps' => $processSteps,
            ];
        });
        
        return response()->json($data)->header('Cache-Control', 'public, max-age=300');
    }

    /**
     * Clear all init-related cache
     * Call this when admin updates data
     */
    public function clearCache()
    {
        $keys = [
            'init_full_v2',
            'settings_raw',
            'nav_links',
            'treatments_list',
            'testimonials_list',
            'results_list',
            'stats_list',
            'faqs_list',
            'locations_list',
            'blogs_list',
            'doctors_list',
            'social_links',
            'process_steps',
        ];

        foreach ($keys as $key) {
            Cache::forget($key);
        }

        return response()->json(['message' => 'Cache cleared successfully']);
    }

    public function index()
    {
        // Branding, WhatsApp, Theme/UI from Settings
        $settingsRaw = Setting::pluck('value', 'key');

        $resolvedSettings = $settingsRaw->map(function ($value, $key) {
            if ($key === 'branding' && isset($value['name']) && is_string($value['name'])) {
                // Final Fix: branding.name must be multilingual JSON
                $value['name'] = [
                    'en' => $value['name'],
                    'ar' => $value['name'],
                    'fr' => $value['name'],
                    'ru' => $value['name']
                ];
            }
            return $this->resolveMedia($value);
        });

        // Merge ui_settings with settings key, preferring 'settings' if both exist
        $uiSettings = $resolvedSettings['settings'] ?? $resolvedSettings['ui_settings'] ?? null;

        $defaultSettings = [
            'primaryColor' => '#F28522',
            'secondaryColor' => '#1E1C4B',
            'fontFamily' => 'Inter',
            'buttonRadius' => '1rem'
        ];

        $mergedSettings = $uiSettings
            ? array_merge($defaultSettings, (array) $uiSettings)
            : $defaultSettings;

        return response()->json([
            'branding' => $resolvedSettings['branding'] ?? [
                'name' => ['en' => 'Lumo Clinic', 'ar' => 'جرافيتي كلينيك', 'fr' => 'Clinique Lumo', 'ru' => 'Клиника Гравити'],
                'logo' => null
            ],
            'settings' => $mergedSettings,
            'ui_settings' => $mergedSettings, // keep backward compat
            'whatsapp' => [
                'phoneNumber' => $resolvedSettings['whatsapp']['phoneNumber'] ?? '+90 541 339 25 69',
                'message' => $resolvedSettings['whatsapp']['message'] ?? ['en' => 'Hello, I would like to inquire about...', 'ar' => 'مرحباً، أود الاستفسار عن...', 'fr' => 'Bonjour, je voudrais me renseigner sur...', 'ru' => 'Здравствуйте, я хотел бы узнать о...'],
                'enabled' => $resolvedSettings['whatsapp']['enabled'] ?? true
            ],
            'seo' => $resolvedSettings['seo'] ?? null,
            'hero' => $resolvedSettings['hero'] ?? null,
            'sections' => $resolvedSettings['sections'] ?? null,
            'why_choose_us_features' => $resolvedSettings['why_choose_us_features'] ?? [],
        ]);
    }

    public function navLinks()
    {
        return response()->json(
            NavbarSection::where('is_active', true)
                ->with([
                    'items' => function ($query) {
                        $query->where('is_active', true)->with('treatment')->orderBy('order');
                    }
                ])
                ->orderBy('order')
                ->get()
                ->map(function ($section) {
                    return [
                        'id' => $section->id,
                        'label' => $section->label,
                        'is_footer' => $section->is_footer,
                        'path' => $section->is_footer ? '#' : null,
                        'children' => $section->items->map(function ($item) {
                            $path = $item->custom_url ?: '#';

                            if ($item->treatment) {
                                $path = "/treatment/{$item->treatment->slug}";
                            }

                            return [
                                'id' => $item->id,
                                'label' => $item->label,
                                'path' => $path,
                                'open_in_new_tab' => $item->open_in_new_tab,
                            ];
                        })
                    ];
                })
        );
    }

    private function resolveMedia($value)
    {
        if (empty($value)) {
            return $value;
        }

        if (is_array($value)) {
            foreach ($value as $k => &$v) {
                $v = $this->resolveMedia($v);
            }
            return $value;
        }

        if (is_string($value)) {
            // Already an absolute URL
            if (str_starts_with($value, 'http')) {
                return $value;
            }

            // Already prefixed with storage/
            if (str_starts_with($value, 'storage/')) {
                return url($value);
            }

            // Relative paths needing storage prefix
            if (str_starts_with($value, 'uploads/') || str_starts_with($value, 'media/')) {
                return url('storage/' . $value);
            }
        }

        return $value;
    }
}
