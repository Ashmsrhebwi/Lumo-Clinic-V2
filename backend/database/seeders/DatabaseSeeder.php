<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Setting;
use App\Models\NavbarSection;
use App\Models\NavbarItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admins ───────────────────────────────────────────
        // Both accounts use updateOrCreate so re-seeding is always safe.
        // The Admin model casts 'password' => 'hashed', but we use Hash::make()
        // explicitly here to be clear and safe regardless of model changes.
        Admin::updateOrCreate(
            ['email' => 'ahmadshahmsardini@gmail.com'],
            ['password' => Hash::make('Admin@2025!')]
        );

        Admin::updateOrCreate(
            ['email' => 'A.agha@Lumo-clinic.com'],
            ['password' => Hash::make('AAGC@8761899')]
        );

        // ── Settings ─────────────────────────────────────────
        $defaults = [
            'branding' => [
                'name' => [
                    'en' => 'Lumo Clinic',
                    'ar' => 'لومو كلينيك',
                    'fr' => 'Clinique Lumo',
                    'ru' => 'Клиника Лумо',
                ],
                'logo' => '/logo.png',
            ],
            'whatsapp' => [
                'phone_number' => '+90 541 339 25 69',
                'message' => [
                    'en' => 'Hello Lumo Clinic, I would like to get more information.',
                    'ar' => 'مرحبًا لومو كلينيك، أود الحصول على مزيد من المعلومات.',
                    'fr' => 'Bonjour Lumo Clinic, j\'aimerais avoir plus d\'informations.',
                    'ru' => 'Здравствуйте, клиника Лумо, я хотел бы получить больше информации.',
                ],
                'enabled' => true,
            ],
            'ui_settings' => [
                'primaryColor'    => '#0484ba',
                'secondaryColor'  => '#1A1842',
                'fontFamily'      => 'Inter',
                'buttonRadius'    => '1rem',
            ],
            'seo' => [
                'title' => [
                    'en' => 'Lumo Clinic – World-Class Medical Tourism, Istanbul',
                    'ar' => 'عيادة لومو – سياحة طبية عالمية في إسطنبول',
                ],
                'description' => [
                    'en' => 'World-class medical tourism in Istanbul. Precision, Artistry, and Innovation.',
                    'ar' => 'سياحة طبية عالمية في اسطنبول. الدقة والفن والابتكار.',
                ],
                'og_image' => '/logo.png',
            ],
            'sections' => [
                'home.treatments' => ['title' => ['en' => 'Our Treatments', 'ar' => 'علاجاتنا'], 'subtitle' => ['en' => 'Expert medical care tailored to your needs.', 'ar' => 'رعاية طبية متخصصة مصممة خصيصاً لاحتياجاتك.']],
                'home.results' => ['title' => ['en' => 'Real Transformations', 'ar' => 'تحولات حقيقية'], 'subtitle' => ['en' => 'See the life-changing results of our patients.', 'ar' => 'شاهد النتائج المذهلة لمرضانا.']],
                'home.testimonials' => ['title' => ['en' => 'Patient Stories', 'ar' => 'قصص المرضى'], 'subtitle' => ['en' => 'Trusted by thousands of patients worldwide.', 'ar' => 'موثوق به من قبل آلاف المرضى حول العالم.']],
                'home.cta' => ['title' => ['en' => 'Ready for Your Transformation?', 'ar' => 'جاهز لتحولك؟'], 'subtitle' => ['en' => 'Book your free consultation with our experts today.', 'ar' => 'احجز استشارتك المجانية مع خبرائنا اليوم.']],
                'home.whyChooseUs' => ['title' => ['en' => 'Why Choose Us', 'ar' => 'لماذا تختارنا'], 'subtitle' => ['en' => 'World-class care, affordable excellence — all in one destination.', 'ar' => 'رعاية عالمية المستوى، تميز بأسعار معقولة - كل ذلك في وجهة واحدة.']],
                'home.stats' => ['title' => ['en' => 'Our Impact', 'ar' => 'تأثيرنا'], 'subtitle' => ['en' => 'Excellence in numbers across the globe.', 'ar' => 'التميز بالأرقام في جميع أنحاء العالم.']],
                'home.process' => ['title' => ['en' => 'Our Process', 'ar' => 'عمليتنا'], 'subtitle' => ['en' => 'Your journey to excellence, simplified into clear, professional steps.', 'ar' => 'رحلتك إلى التميز، مبسطة إلى خطوات واضحة ومهنية.']],
                'about.appointment' => ['title' => ['en' => 'Book Your Appointment', 'ar' => 'احجز موعدك'], 'subtitle' => ['en' => 'Start your journey with Lumo Clinic today.', 'ar' => 'ابدأ رحلتك مع لومو كلينيك اليوم.']],
                'about.contact' => ['title' => ['en' => 'Contact Us', 'ar' => 'اتصل بنا'], 'subtitle' => ['en' => 'We are here to help you 24/7.', 'ar' => 'نحن هنا لمساعدتك على مدار الساعة طوال أيام الأسبوع.']]
            ],
            'why_choose_us_features' => [
                ['icon' => 'Award', 'title' => ['en' => 'Expert Specialists', 'ar' => 'أخصائيون خبراء'], 'desc' => ['en' => 'Board-certified doctors with international experience.', 'ar' => 'أطباء معتمدون من البورد مع خبرة دولية.']],
                ['icon' => 'Building2', 'title' => ['en' => 'Modern Facilities', 'ar' => 'مرافق حديثة'], 'desc' => ['en' => 'State-of-the-art equipment and technology.', 'ar' => 'أحدث المعدات والتقنيات.']],
                ['icon' => 'Paintbrush', 'title' => ['en' => 'Artistry & Precision', 'ar' => 'الفن والدقة'], 'desc' => ['en' => 'Tailored aesthetic designs for your unique features.', 'ar' => 'تصاميم جمالية مصممة خصيصاً لميزاتك الفريدة.']],
                ['icon' => 'Package', 'title' => ['en' => 'All-Inclusive Packages', 'ar' => 'باقات شاملة'], 'desc' => ['en' => 'Treatment, accommodation, and transfers included.', 'ar' => 'العلاج والإقامة والانتقالات مشمولة.']],
            ],
            'social_links' => [
                ['platform' => 'Instagram', 'url' => 'https://www.instagram.com/lumo.clinic?igsh=MTUyN2FoOGN0Mnpobw==', 'iconName' => 'Instagram'],
                ['platform' => 'Facebook', 'url' => 'https://www.facebook.com/share/17m54mzFqv/', 'iconName' => 'Facebook'],
            ]
        ];

        foreach ($defaults as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // ── Treatments & Navigation ──────────────────────────
        $this->call([
            FullTreatmentSeeder::class,
            NavigationSeeder::class,
        ]);
    }
}
