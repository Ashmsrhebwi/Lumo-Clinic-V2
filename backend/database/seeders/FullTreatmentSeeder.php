<?php

namespace Database\Seeders;

use App\Models\Treatment;
use Illuminate\Database\Seeder;

class FullTreatmentSeeder extends Seeder
{
    public function run(): void
    {
        $treatments = [
            [
                'slug' => 'dental-implant',
                'category' => ['en' => 'Dental', 'ar' => 'الأسنان', 'fr' => 'Dentaire', 'ru' => 'Стоматология'],
                'title' => ['en' => 'Dental Implant', 'ar' => 'زراعة الأسنان', 'fr' => 'Implant Dentaire', 'ru' => 'Имплантация'],
                'description' => [
                    'en' => 'Restore your smile with permanent, high-quality dental implants that look and feel natural.',
                    'ar' => 'استعد ابتسامتك بزراعة أسنان دائمة وعالية الجودة تبدو طبيعية تمامًا.',
                    'fr' => 'Retrouvez votre sourire grâce à des implants dentaires permanents et de haute qualité.',
                    'ru' => 'Верните себе улыбку с помощью постоянных высококачественных зубных имплантатов.'
                ],
                'success_rate' => 99,
                'duration' => ['en' => '2-3 Days', 'ar' => '2-3 أيام', 'fr' => '2-3 Jours', 'ru' => '2-3 Дня'],
                'template_type' => 'dental',
                'content_sections' => [
                    [
                        'title' => ['en' => 'Why Choose Dental Implants?', 'ar' => 'لماذا تختار زراعة الأسنان؟'],
                        'subtitle' => ['en' => 'A Permanent Solution', 'ar' => 'حل دائم'],
                        'description' => ['en' => 'Dental implants are the gold standard for tooth replacement, offering unmatched stability and aesthetics.', 'ar' => 'تعتبر زراعة الأسنان هي المعيار الذهبي لاستبدال الأسنان المفقودة.']
                    ]
                ]
            ],
            [
                'slug' => 'hollywood-smile',
                'category' => ['en' => 'Dental', 'ar' => 'الأسنان', 'fr' => 'Dentaire', 'ru' => 'Стоматология'],
                'title' => ['en' => 'Hollywood Smile', 'ar' => 'إبتسامة هوليود', 'fr' => 'Sourire Hollywood', 'ru' => 'Голливудская Улыбка'],
                'description' => [
                    'en' => 'The ultimate aesthetic transformation using ultra-thin porcelain veneers to create a perfect, white smile.',
                    'ar' => 'التحول الجمالي النهائي باستخدام قشور البورسلين الرقيقة جداً للحصول على ابتسامة بيضاء مثالية.',
                ],
                'success_rate' => 100,
                'duration' => ['en' => '5-7 Days', 'ar' => '5-7 أيام'],
                'template_type' => 'dental',
                'content_sections' => [
                    [
                        'title' => ['en' => 'Precision Smile Design', 'ar' => 'تصميم الابتسامة الدقيق'],
                        'description' => ['en' => 'Every Hollywood Smile is custom-designed using digital mapping to match your facial symmetry.', 'ar' => 'يتم تصميم كل ابتسامة هوليود بشكل مخصص ليتناسب مع ملامح وجهك.']
                    ]
                ]
            ],
            [
                'slug' => 'male-hair-transplant',
                'category' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка Волос'],
                'title' => ['en' => 'Male Hair Transplant', 'ar' => 'زراعة الشعر للرجال', 'fr' => 'Greffe Homme', 'ru' => 'Мужчины'],
                'description' => [
                    'en' => 'Restore your natural hairline and hair density with our advanced FUE and DHI techniques.',
                    'ar' => 'استعد خط الشعر الطبيعي وكثافة الشعر بتقنيات FUE و DHI المتقدمة.',
                ],
                'success_rate' => 98,
                'duration' => ['en' => '1 Day', 'ar' => 'يوم واحد'],
                'template_type' => 'hair',
                'content_sections' => [
                    [
                        'title' => ['en' => 'Advanced FUE Technique', 'ar' => 'تقنية FUE المتقدمة'],
                        'description' => ['en' => 'Our specialists use the latest extraction methods to ensure maximum graft survival and minimal scarring.', 'ar' => 'يستخدم أخصائيونا أحدث طرق الاقتطاف لضمان أقصى قدر من بقاء البصيلات.']
                    ]
                ]
            ],
            [
                'slug' => 'female-hair-transplant',
                'category' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка Волос'],
                'title' => ['en' => 'Female Hair Transplant', 'ar' => 'زراعة الشعر للنساء', 'fr' => 'Greffe Femme', 'ru' => 'Женщины'],
                'description' => [
                    'en' => 'Specialized hair restoration for women focusing on density and thinning areas without full shaving.',
                    'ar' => 'استعادة الشعر المتخصصة للنساء مع التركيز على الكثافة والمناطق الخفيفة دون الحاجة للحلاقة الكاملة.',
                ],
                'success_rate' => 97,
                'duration' => ['en' => '1 Day', 'ar' => 'يوم واحد'],
                'template_type' => 'hair',
                'content_sections' => [
                    [
                        'title' => ['en' => 'No-Shave Techniques', 'ar' => 'تقنيات بدون حلاقة'],
                        'description' => ['en' => 'We offer discreet hair restoration solutions designed specifically for the unique needs of women.', 'ar' => 'نقدم حلول استعادة الشعر السرية والمصممة خصيصاً لاحتياجات النساء الفريدة.']
                    ]
                ]
            ],
            [
                'slug' => 'beard-moustache-transplant',
                'category' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка Волос'],
                'title' => ['en' => 'Beard & Moustache Transplant', 'ar' => 'زراعة اللحية والشارب', 'fr' => 'Greffe Barbe', 'ru' => 'Борода'],
                'description' => [
                    'en' => 'Achieve a fuller, well-defined beard or moustache with precision follicle placement.',
                    'ar' => 'احصل على لحية أو شارب أكثر كثافة وتحديداً من خلال الزراعة الدقيقة للبصيلات.',
                ],
                'success_rate' => 99,
                'duration' => ['en' => '1 Day', 'ar' => 'يوم واحد'],
                'template_type' => 'hair',
                'content_sections' => [
                    [
                        'title' => ['en' => 'Artistic Facial Design', 'ar' => 'تصميم الوجه الفني'],
                        'description' => ['en' => 'We map your facial features to design a beard that enhances your natural appearance.', 'ar' => 'نرسق ملامح وجهك لتصميم لحية تعزز مظهرك الطبيعي.']
                    ]
                ]
            ],
            [
                'slug' => 'eyebrow-transplant',
                'category' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка Волос'],
                'title' => ['en' => 'Eyebrow Transplant', 'ar' => 'زراعة الحواجب', 'fr' => 'Greffe Sourcils', 'ru' => 'Брови'],
                'description' => [
                    'en' => 'Enhance your facial expression with perfectly shaped and dense eyebrows.',
                    'ar' => 'عزز تعبيرات وجهك بحواجب كثيفة ومصممة بشكل مثالي.',
                ],
                'success_rate' => 98,
                'duration' => ['en' => '4-6 Hours', 'ar' => '4-6 ساعات'],
                'template_type' => 'hair',
                'content_sections' => [
                    [
                        'title' => ['en' => 'Micro-DHI Precision', 'ar' => 'دقة Micro-DHI'],
                        'description' => ['en' => 'Each eyebrow hair is placed individually to match the natural angle and growth direction.', 'ar' => 'يتم وضع كل شعرة حاجب على حدة لتتناسب مع الزاوية الطبيعية واتجاه النمو.']
                    ]
                ]
            ],
        ];

        Treatment::query()->delete();

        foreach ($treatments as $data) {
            Treatment::create(array_merge($data, [
                'is_active' => true,
                'order' => 1
            ]));
        }
    }
}
