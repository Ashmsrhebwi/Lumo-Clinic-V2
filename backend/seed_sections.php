<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use App\Models\Setting;

// Initialize Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Seeding Sections Data to Settings Table ===\n\n";

// Define sections data based on VALID_SECTION_KEYS
$sectionsData = [
    'home.treatments' => [
        'title' => [
            'en' => 'Elite Medical Solutions',
            'ar' => 'حلول طبية متميزة',
            'fr' => 'Solutions Médicales d\'Élite',
            'ru' => 'Элитные Медицинские Решения'
        ],
        'subtitle' => [
            'en' => 'Precision-driven treatments designed to enhance your natural beauty and well-being.',
            'ar' => 'علاجات دقيقة مصممة لتعزيز جمالك الطبيعي ورفاهيتك.',
            'fr' => 'Traitements de précision conçus pour améliorer votre beauté naturelle et votre bien-être.',
            'ru' => 'Лечения на основе точности, разработанные для улучшения вашей естественной красоты и благополучия.'
        ]
    ],
    'home.cta' => [
        'title' => [
            'en' => 'Begin Your Aesthetic Evolution',
            'ar' => 'ابدأ تطورك الجمالي',
            'fr' => 'Commencez Votre Évolution Esthétique',
            'ru' => 'Начните Свою Эстетическую Эволюцию'
        ],
        'subtitle' => [
            'en' => 'A private consultation with our specialists is the first step toward a transformation that lasts a lifetime.',
            'ar' => 'الاستشارة الخاصة مع خبرائنا هي الخطوة الأولى نحو تحول يدوم مدى الحياة.',
            'fr' => 'Une consultation privée avec nos spécialistes est la première étape vers une transformation qui dure toute la vie.',
            'ru' => 'Частная консультация с нашими специалистами — первый шаг к трансформации, которая продлится всю жизнь.'
        ]
    ],
    'home.whyChooseUs' => [
        'title' => [
            'en' => 'Why Choose Us',
            'ar' => 'لماذا تختارنا',
            'fr' => 'Pourquoi Nous Choisir',
            'ru' => 'Почему Выбирают Нас'
        ],
        'subtitle' => [
            'en' => 'World-class medical excellence combined with luxury concierge care.',
            'ar' => 'التميز الطبي العالمي مع الرعاية الفاخرة المخصصة.',
            'fr' => 'Excellence médicale de classe mondiale combinée à des soins de concierge de luxe.',
            'ru' => 'Мировой медицинский стандарт в сочетании с роскошным сервисом консьерж.'
        ]
    ],
    'home.testimonials' => [
        'title' => [
            'en' => 'What Our Patients Say',
            'ar' => 'ماذا يقول مرضانا',
            'fr' => 'Ce Que Disent Nos Patients',
            'ru' => 'Что Говорят Наши Пациенты'
        ],
        'subtitle' => [
            'en' => 'Real stories from real patients about their transformative journeys.',
            'ar' => 'قصص حقيقية من مرضانا عن رحلاتهم التحويلية.',
            'fr' => 'Histoires réelles de vrais patients sur leurs voyages transformateurs.',
            'ru' => 'Реальные истории реальных пациентов об их трансформационных путешествиях.'
        ]
    ],
    'home.stats' => [
        'title' => [
            'en' => 'Our Impact',
            'ar' => 'تأثيرنا',
            'fr' => 'Notre Impact',
            'ru' => 'Наше Влияние'
        ],
        'subtitle' => [
            'en' => 'Numbers that reflect our commitment to excellence.',
            'ar' => 'أرقام تعكس التزامنا بالتميز.',
            'fr' => 'Des chiffres qui reflètent notre engagement envers l\'excellence.',
            'ru' => 'Цифры, отражающие нашу приверженность к совершенству.'
        ]
    ],
    'home.process' => [
        'title' => [
            'en' => 'Our Process',
            'ar' => 'عمليتنا',
            'fr' => 'Notre Processus',
            'ru' => 'Наш Процесс'
        ],
        'subtitle' => [
            'en' => 'A seamless journey from consultation to transformation.',
            'ar' => 'رحلة سلسة من الاستشارة إلى التحول.',
            'fr' => 'Un voyage sans faille de la consultation à la transformation.',
            'ru' => 'Бесшовное путешествие от консультации до трансформации.'
        ]
    ],
    'home.results' => [
        'title' => [
            'en' => 'Signature Transformations',
            'ar' => 'التحولات المميزة',
            'fr' => 'Transformations Signature',
            'ru' => 'Сигнатурные Трансформации'
        ],
        'subtitle' => [
            'en' => 'Witness the power of precision and artistry through our patient success stories.',
            'ar' => 'شاهد قوة الدقة والفن من خلال قصص نجاح مرضانا.',
            'fr' => 'Témoignez de la puissance de la précision et de l\'art à travers nos histoires de réussite de patients.',
            'ru' => 'Увидьте силу точности и мастерства через истории успеха наших пациентов.'
        ]
    ],
    'home.hero' => [
        'title' => [
            'en' => 'Redefine Your True Aesthetics',
            'ar' => 'أعد اكتشاف جمالك الحقيقي',
            'fr' => 'Redéfinissez Votre Véritable Beauté',
            'ru' => 'Переопределите Свою Истинную Красоту'
        ],
        'subtitle' => [
            'en' => 'Elevate your confidence with world-class medical excellence.',
            'ar' => 'ارتق بثقتك مع التميز الطبي العالمي.',
            'fr' => 'Améliorez votre confiance avec l\'excellence médicale de classe mondiale.',
            'ru' => 'Повысьте свою уверенность с мировым медицинским совершенством.'
        ]
    ],
    'plastic.hero' => [
        'title' => [
            'en' => 'Plastic Surgery Excellence',
            'ar' => 'التميز في جراحة التجميل',
            'fr' => 'Excellence en Chirurgie Plastique',
            'ru' => 'Превосходство Пластической Хирургии'
        ],
        'subtitle' => [
            'en' => 'Artistry meets medical precision for transformative results.',
            'ar' => 'الفن يلتقي بالدقة الطبية لنتائج تحويلية.',
            'fr' => 'L\'art rencontre la précision médicale pour des résultats transformateurs.',
            'ru' => 'Мастерство встречается с медицинской точностью для трансформационных результатов.'
        ]
    ],
    'plastic.journey' => [
        'title' => [
            'en' => 'Your Transformation Journey',
            'ar' => 'رحلة تحولك',
            'fr' => 'Votre Voyage de Transformation',
            'ru' => 'Ваше Путешествие Трансформации'
        ],
        'subtitle' => [
            'en' => 'From consultation to recovery, we guide you every step of the way.',
            'ar' => 'من الاستشارة إلى التعافي، نوجهك في كل خطوة.',
            'fr' => 'De la consultation au rétablissement, nous vous guidons à chaque étape.',
            'ru' => 'От консультации до восстановления мы сопровождаем вас на каждом этапе.'
        ]
    ],
    'dental.hero' => [
        'title' => [
            'en' => 'Dental Excellence',
            'ar' => 'التميز في طب الأسنان',
            'fr' => 'Excellence Dentaire',
            'ru' => 'Превосходство Стоматологии'
        ],
        'subtitle' => [
            'en' => 'Advanced dental care for a perfect smile.',
            'ar' => 'رعاية أسنان متقدمة لابتسامة مثالية.',
            'fr' => 'Soins dentaires avancés pour un sourire parfait.',
            'ru' => 'Передовая стоматологическая помощь для идеальной улыбки.'
        ]
    ],
    'dental.cta' => [
        'title' => [
            'en' => 'Transform Your Smile',
            'ar' => 'حول ابتسامتك',
            'fr' => 'Transformez Votre Sourire',
            'ru' => 'Преобразуйте Свою Улыбку'
        ],
        'subtitle' => [
            'en' => 'Schedule your consultation today.',
            'ar' => 'حدد موعد استشارتك اليوم.',
            'fr' => 'Planifiez votre consultation dès aujourd\'hui.',
            'ru' => 'Запишитесь на консультацию сегодня.'
        ]
    ],
    'dental.procedures' => [
        'title' => [
            'en' => 'Our Dental Procedures',
            'ar' => 'إجراءاتنا الأسنان',
            'fr' => 'Nos Procédures Dentaires',
            'ru' => 'Наши Стоматологические Процедуры'
        ],
        'subtitle' => [
            'en' => 'Comprehensive dental solutions for all your needs.',
            'ar' => 'حلول أسنان شاملة لجميع احتياجاتك.',
            'fr' => 'Solutions dentaires complètes pour tous vos besoins.',
            'ru' => 'Комплексные стоматологические решения для всех ваших потребностей.'
        ]
    ],
    'dental.care' => [
        'title' => [
            'en' => 'Dental Care',
            'ar' => 'رعاية الأسنان',
            'fr' => 'Soins Dentaires',
            'ru' => 'Стоматологический Уход'
        ],
        'subtitle' => [
            'en' => 'Expert care for lasting dental health.',
            'ar' => 'رعاية خبيرة لصحة أسنان دائمة.',
            'fr' => 'Soins experts pour une santé dentaire durable.',
            'ru' => 'Экспертный уход для долгосрочного здоровья зубов.'
        ]
    ],
    'dental.results' => [
        'title' => [
            'en' => 'Dental Transformations',
            'ar' => 'تحولات الأسنان',
            'fr' => 'Transformations Dentaires',
            'ru' => 'Стоматологические Трансформации'
        ],
        'subtitle' => [
            'en' => 'See the difference our expertise makes.',
            'ar' => 'شاهد الفرق الذي يحدثه خبرتنا.',
            'fr' => 'Voyez la différence que notre expertise apporte.',
            'ru' => 'Увидите разницу, которую вносит наш опыт.'
        ]
    ],
    'hair.hero' => [
        'title' => [
            'en' => 'Hair Restoration Excellence',
            'ar' => 'التميز في استعادة الشعر',
            'fr' => 'Excellence en Restauration Capillaire',
            'ru' => 'Превосходство Восстановления Волос'
        ],
        'subtitle' => [
            'en' => 'Advanced hair transplant solutions for natural results.',
            'ar' => 'حلول متقدمة لزراعة الشعر لنتائج طبيعية.',
            'fr' => 'Solutions avancées de greffe de cheveux pour des résultats naturels.',
            'ru' => 'Передовые решения по пересадке волос для естественных результатов.'
        ]
    ],
    'hair.procedures' => [
        'title' => [
            'en' => 'Hair Procedures',
            'ar' => 'إجراءات الشعر',
            'fr' => 'Procédures Capillaires',
            'ru' => 'Процедуры для Волос'
        ],
        'subtitle' => [
            'en' => 'Specialized treatments for all hair concerns.',
            'ar' => 'علاجات متخصصة لجميع مشاكل الشعر.',
            'fr' => 'Traitements spécialisés pour tous les problèmes capillaires.',
            'ru' => 'Специализированные процедуры для всех проблем с волосами.'
        ]
    ],
    'hair.features' => [
        'title' => [
            'en' => 'Why Choose Us',
            'ar' => 'لماذا تختارنا',
            'fr' => 'Pourquoi Nous Choisir',
            'ru' => 'Почему Выбирают Нас'
        ],
        'subtitle' => [
            'en' => 'Expert care with proven results.',
            'ar' => 'رعاية خبيرة بنتائج مثبتة.',
            'fr' => 'Soins experts avec des résultats prouvés.',
            'ru' => 'Экспертный уход с доказанными результатами.'
        ]
    ],
    'contact.hero' => [
        'title' => [
            'en' => 'Contact Us',
            'ar' => 'اتصل بنا',
            'fr' => 'Contactez-Nous',
            'ru' => 'Свяжитесь с Нами'
        ],
        'subtitle' => [
            'en' => 'We\'re here to help you on your journey.',
            'ar' => 'نحن هنا لمساعدتك في رحلتك.',
            'fr' => 'Nous sommes là pour vous aider dans votre voyage.',
            'ru' => 'Мы здесь, чтобы помочь вам в вашем путешествии.'
        ]
    ],
    'contact.faq' => [
        'title' => [
            'en' => 'Frequently Asked Questions',
            'ar' => 'الأسئلة الشائعة',
            'fr' => 'Questions Fréquentes',
            'ru' => 'Часто Задаваемые Вопросы'
        ],
        'subtitle' => [
            'en' => 'Find answers to common questions.',
            'ar' => 'ابحث عن إجابات للأسئلة الشائعة.',
            'fr' => 'Trouvez des réponses aux questions courantes.',
            'ru' => 'Найдите ответы на распространенные вопросы.'
        ]
    ],
    'booking.hero' => [
        'title' => [
            'en' => 'Book Your Consultation',
            'ar' => 'احجز استشارتك',
            'fr' => 'Réservez Votre Consultation',
            'ru' => 'Запишитесь на Консультацию'
        ],
        'subtitle' => [
            'en' => 'Take the first step towards your transformation.',
            'ar' => 'اتخذ الخطوة الأولى نحو تحولك.',
            'fr' => 'Faites le premier pas vers votre transformation.',
            'ru' => 'Сделайте первый шаг к вашей трансформации.'
        ]
    ],
    'booking.step1' => [
        'title' => [
            'en' => 'Select Your Treatment',
            'ar' => 'اختر علاجك',
            'fr' => 'Sélectionnez Votre Traitement',
            'ru' => 'Выберите Свое Лечение'
        ],
        'subtitle' => [
            'en' => 'Choose from our range of premium treatments.',
            'ar' => 'اختر من مجموعة علاجاتنا المتميزة.',
            'fr' => 'Choisissez parmi notre gamme de traitements premium.',
            'ru' => 'Выберите из нашего премиального набора процедур.'
        ]
    ],
    'articles.hero' => [
        'title' => [
            'en' => 'Latest Insights',
            'ar' => 'أحدث الرؤى',
            'fr' => 'Dernières Informations',
            'ru' => 'Последние Инсайты'
        ],
        'subtitle' => [
            'en' => 'Stay informed with our latest articles.',
            'ar' => 'ابق على اطلاع مع أحدث مقالاتنا.',
            'fr' => 'Restez informé avec nos derniers articles.',
            'ru' => 'Будьте в курсе с нашими последними статьями.'
        ]
    ],
    'doctors.hero' => [
        'title' => [
            'en' => 'Our Expert Team',
            'ar' => 'فريقنا الخبير',
            'fr' => 'Notre Équipe d\'Experts',
            'ru' => 'Наша Команда Экспертов'
        ],
        'subtitle' => [
            'en' => 'Meet the specialists behind our excellence.',
            'ar' => 'تعرف على الخبراء وراء تميزنا.',
            'fr' => 'Rencontrez les spécialistes derrière notre excellence.',
            'ru' => 'Познакомьтесь со специалистами, стоящими за нашим превосходством.'
        ]
    ],
    'about.contact' => [
        'title' => [
            'en' => 'Get in Touch',
            'ar' => 'تواصل معنا',
            'fr' => 'Entrer en Contact',
            'ru' => 'Связаться с Нами'
        ],
        'subtitle' => [
            'en' => 'We\'d love to hear from you.',
            'ar' => 'نود أن نسمع منك.',
            'fr' => 'Nous aimerions avoir de vos nouvelles.',
            'ru' => 'Мы будем рады услышать от вас.'
        ]
    ]
];

try {
    // Check if sections key already exists
    $existing = Setting::where('key', 'sections')->first();
    
    if ($existing) {
        echo "⚠️  Sections key already exists in settings table.\n";
        echo "Current data: " . json_encode($existing->value, JSON_PRETTY_PRINT) . "\n\n";
        
        $response = readline("Do you want to overwrite it? (yes/no): ");
        if (strtolower(trim($response)) !== 'yes') {
            echo "❌ Operation cancelled.\n";
            exit(0);
        }
        
        // Update existing
        $existing->value = $sectionsData;
        $existing->save();
        echo "✅ Sections key updated successfully.\n";
    } else {
        // Insert new
        Setting::create([
            'key' => 'sections',
            'value' => $sectionsData
        ]);
        echo "✅ Sections key inserted successfully.\n";
    }
    
    // Verify the insertion
    $verified = Setting::where('key', 'sections')->first();
    echo "\n📋 Verification:\n";
    echo "Key exists: " . ($verified ? 'Yes' : 'No') . "\n";
    echo "Number of sections: " . count($verified->value ?? []) . "\n";
    echo "Section keys: " . implode(', ', array_keys($verified->value ?? [])) . "\n";
    
    echo "\n✨ Seeding completed successfully!\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}
