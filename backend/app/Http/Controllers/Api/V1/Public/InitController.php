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

class InitController extends Controller
{
    /**
     * Aggregated Initializer for Frontend Hydration
     * 
     * returns all data needed for the first render in a single request.
     */
    public function initFull()
    {
        // 1. Settings & Branding
        $settingsRaw = Setting::whereIn('key', ['branding', 'whatsapp', 'ui_settings', 'settings', 'seo', 'hero', 'sections', 'why_choose_us_features'])->pluck('value', 'key');
        $settings = $settingsRaw->map(function ($value, $key) {
            if ($key === 'branding' && isset($value['name']) && is_string($value['name'])) {
                $value['name'] = ['en' => $value['name'], 'ar' => $value['name'], 'fr' => $value['name'], 'ru' => $value['name']];
            }
            return $this->resolveMedia($value);
        });

        // 2. Navigation
        $navLinks = NavbarSection::where('is_active', true)
            ->with(['items' => fn($q) => $q->where('is_active', true)->with('treatment')->orderBy('order')])
            ->orderBy('order')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id, 'label' => $s->label, 'is_footer' => $s->is_footer, 'path' => $s->is_footer ? '#' : null,
                'children' => $s->items->map(fn($i) => [
                    'id' => $i->id, 'label' => $i->label, 'path' => $i->treatment ? "/treatment/{$i->treatment->slug}" : ($i->custom_url ?: '#'),
                    'open_in_new_tab' => $i->open_in_new_tab,
                ])
            ]);

        // 3. Treatments (Lightweight Listing for Grid/Cards)
        $treatments = Treatment::where('is_active', true)
            ->with('media') // Fix N+1: eager load thumbnail
            ->orderBy('order')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id, 
                'slug' => $t->slug, 
                'category' => $t->category, 
                'title' => $t->title,
                'image' => $t->image, 
                'media_url' => $t->image, // consistency
                'description' => $t->description, 
                'features' => $t->features, 
                'successRate' => $t->success_rate,
                'duration' => $t->duration, 
                'template_type' => $t->template_type,
                // REMOVED: content_sections, large text blocks for initial load
            ]);

        // 4. Secondary Content (Eager loaded & simplified)
        $testimonials = Testimonial::where('is_active', true)
            ->with('treatment:id,slug') // Only fetch needed treatment relation fields
            ->latest()
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'patient_name' => $t->patient_name,
                'feedback' => $t->feedback,
                'rating' => $t->rating,
                'treatment_slug' => $t->treatment ? $t->treatment->slug : null,
            ]);

        $results = Result::where('is_active', true)
            ->with(['beforeMedia', 'afterMedia', 'treatment:id,slug']) // Fix N+1: eager load media
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'patient_name' => $r->patient_name,
                'story' => $r->story,
                'before_image_url' => $r->before_image_url,
                'after_image_url' => $r->after_image_url,
                'treatment_slug' => $r->treatment ? $r->treatment->slug : null,
            ]);

        $stats = Stat::all();
        $faqs = Faq::all();
        $locations = Location::where('is_active', true)->get();

        $blogs = Article::where('is_active', true)
            ->with(['image', 'treatment:id,slug']) // Fix N+1: eager load media
            ->latest()
            ->get()
            ->map(fn($b) => [
                'id' => $b->id, 'slug' => $b->slug, 'title' => $b->title, 'category' => $b->category, 
                'treatment_slug' => $b->treatment ? $b->treatment->slug : null,
                'excerpt' => $b->excerpt, 'author' => $b->author, 
                'read_time' => $b->read_time, 'media_url' => $b->media_url,
                // REMOVED: content for list view
            ]);

        $doctors = Doctor::where('is_active', true)
            ->with('image') // Fix N+1: eager load doctor images
            ->get();

        $socialLinks = SocialLink::all();
        $processSteps = ProcessStep::where('is_active', true)->orderBy('order')->get();

        return response()->json([
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
        ]);
    }

    public function index()
    {
        // Branding, WhatsApp, Theme/UI from Settings
        $settings = Setting::whereIn('key', ['branding', 'whatsapp', 'ui_settings', 'settings', 'seo', 'hero', 'sections', 'why_choose_us_features'])->pluck('value', 'key');

        $resolvedSettings = $settings->map(function ($value, $key) {
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
                'name' => ['en' => 'Gravity Clinic', 'ar' => 'جرافيتي كلينيك', 'fr' => 'Clinique Gravity', 'ru' => 'Клиника Гравити'],
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
