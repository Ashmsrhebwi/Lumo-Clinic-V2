<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SocialLink;

class SocialLinksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate existing links to ensure a fresh state
        SocialLink::truncate();

        $links = [
            [
                'platform' => 'Instagram',
                'url' => 'https://www.instagram.com/gravityclinicofficial/',
                'icon_name' => 'Instagram',
                'is_active' => true,
            ],
            [
                'platform' => 'Facebook',
                'url' => 'https://www.facebook.com/GARVITYCLINICOFFICIAL/',
                'icon_name' => 'Facebook',
                'is_active' => true,
            ],
            [
                'platform' => 'X',
                'url' => 'https://x.com/clinic_gravity?s=11&t=4xMb6e3uZrJFVgG5Iap1EA',
                'icon_name' => 'X',
                'is_active' => true,
            ],
            [
                'platform' => 'TikTok',
                'url' => 'https://www.tiktok.com/discover/gravity-clinic-turkey-istanbul-teeth',
                'icon_name' => 'TikTok',
                'is_active' => true,
            ],
            [
                'platform' => 'LinkedIn',
                'url' => 'https://www.linkedin.com/company/gravityclinic/?originalSubdomain=tr',
                'icon_name' => 'Linkedin',
                'is_active' => true,
            ],
        ];

        foreach ($links as $link) {
            SocialLink::create($link);
        }
    }
}
