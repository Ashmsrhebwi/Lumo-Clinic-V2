<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TreatmentContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hollywood Smile
        \App\Models\Treatment::where('slug', 'hollywood-smile')->update([
            'content_sections' => [
                [
                    'title' => ['en' => 'The Hollywood Smile Procedure', 'ar' => 'إجراء ابتسامة هوليود', 'fr' => 'La procédure du sourire hollywoodien', 'ru' => 'Процедура Голливудская улыбка'],
                    'subtitle' => ['en' => 'A Step-by-Step Transformation', 'ar' => 'تحول خطوة بخطوة', 'fr' => 'Une transformation étape par étape', 'ru' => 'Пошаговое преображение'],
                    'description' => [
                        'en' => 'Our approach to the Hollywood Smile combines digital smile design with the highest quality porcelain veneers. We ensure that every tooth is perfectly aligned, shaped, and shaded to complement your facial features.',
                        'ar' => 'يجمع نهجنا في ابتسامة هوليود بين التصميم الرقمي للابتسامة وأعلى جودة من قشور البورسلين. نحن نضمن أن كل سن مصطف تمامًا ومُشكل ومُظلل ليكمل ملامح وجهك.',
                        'fr' => 'Notre approche du sourire hollywoodien combine la conception numérique du sourire avec des facettes en porcelaine de la plus haute qualité. Nous veillons à ce que chaque dent soit parfaitement alignée, façonnée et ombragée pour compléter les traits de votre visage.',
                        'ru' => 'Наш подход к созданию голливудской улыбки сочетает в себе цифровой дизайн улыбки и высококачественные фарфоровые виниры. Мы гарантируем, что каждый зуб будет идеально выровнен, сформирован и затенен в соответствии с чертами вашего лица.'
                    ]
                ],
                [
                    'title' => ['en' => 'Dental consultation', 'ar' => 'استشارة الأسنان', 'fr' => 'Consultation dentaire', 'ru' => 'Стоматологическая консультация'],
                    'subtitle' => ['en' => 'Step 1', 'ar' => 'الخطوة 1', 'fr' => 'Étape 1', 'ru' => 'Шаг 1'],
                    'description' => [
                        'en' => 'The first step is a comprehensive examination of your oral health. We use 3D imaging to map your current smile and discuss your aesthetic goals.',
                        'ar' => 'الخطوة الأولى هي فحص شامل لصحة فمك. نستخدم التصوير ثلاثي الأبعاد لرسم خريطة لابتسامتك الحالية ومناقشة أهدافك الجمالية.',
                        'fr' => 'La première étape est un examen complet de votre santé bucco-dentaire. Nous utilisons l\'imagerie 3D pour cartographier votre sourire actuel et discuter de vos objectifs esthétiques.',
                        'ru' => 'Первым шагом является комплексное обследование состояния полости рта. Мы используем 3D-визуализацию, чтобы составить карту вашей нынешней улыбки и обсудить ваши эстетические цели.'
                    ]
                ],
                [
                    'title' => ['en' => 'Smile Design', 'ar' => 'تصميم الابتسامة', 'fr' => 'Conception du sourire', 'ru' => 'Дизайн улыбки'],
                    'subtitle' => ['en' => 'Step 2', 'ar' => 'الخطوة 2', 'fr' => 'Étape 2', 'ru' => 'Шаг 2'],
                    'description' => [
                        'en' => 'Using advanced software, we create a digital preview of your new smile. This allows you to see the results before we even begin.',
                        'ar' => 'باستخدام برامج متقدمة، نقوم بإنشاء معاينة رقمية لابتسامتك الجديدة. هذا يتيح لك رؤية النتائج قبل أن نبدأ حتى.',
                        'fr' => 'À l\'aide de logiciels avancés, nous créons un aperçu numérique de votre nouveau sourire. Cela vous permet de voir les résultats avant même que nous commencions.',
                        'ru' => 'Используя передовое программное обеспечение, мы создаем цифровой предварительный просмотр вашей новой улыбки. Это позволяет вам увидеть результаты еще до того, как мы начнем.'
                    ]
                ],
                [
                    'title' => ['en' => 'Teeth Preparation', 'ar' => 'تحضير الأسنان', 'fr' => 'Préparation des dents', 'ru' => 'Подготовка зубов'],
                    'subtitle' => ['en' => 'Step 3', 'ar' => 'الخطوة 3', 'fr' => 'Étape 3', 'ru' => 'Шаг 3'],
                    'description' => [
                        'en' => 'A minimal amount of enamel is removed to ensure the veneers sit perfectly flush with your natural teeth, maintain a natural look.',
                        'ar' => 'يتم إزالة كمية ضئيلة من المينا لضمان استقرار القشور تمامًا مع أسنانك الطبيعية، والحفاظ على مظهر طبيعي.',
                        'fr' => 'Une quantité minimale d\'émail est retirée pour garantir que les facettes s\'alignent parfaitement avec vos dents naturelles, tout en conservant un aspect naturel.',
                        'ru' => 'Удаляется минимальное количество эмали, чтобы виниры идеально прилегали к вашим естественным зубам, сохраняя при этом естественный вид.'
                    ]
                ],
                [
                    'title' => ['en' => 'Final Placement', 'ar' => 'التركيب النهائي', 'fr' => 'Placement final', 'ru' => 'Окончательное размещение'],
                    'subtitle' => ['en' => 'Step 4', 'ar' => 'الخطوة 4', 'fr' => 'Étape 4', 'ru' => 'Шаг 4'],
                    'description' => [
                        'en' => 'The custom-made porcelain veneers are bonded to your teeth, instantly creating your beautiful, permanent Hollywood Smile.',
                        'ar' => 'يتم لصق قشور البورسلين المصنوعة خصيصًا بأسنانك، مما يخلق على الفور ابتسامة هوليود الجميلة والدائمة.',
                        'fr' => 'Les facettes en porcelaine sur mesure sont collées à vos dents, créant instantanément votre beau sourire hollywoodien permanent.',
                        'ru' => 'Изготовленные на заказ фарфоровые виниры прикрепляются к вашим зубам, мгновенно создавая вашу красивую, постоянную голливудскую улыбку.'
                    ]
                ]
            ]
        ]);

        // Male Hair Transplant
        \App\Models\Treatment::where('slug', 'male-hair-transplant')->update([
            'content_sections' => [
                [
                    'title' => ['en' => 'Understanding Male Pattern Baldness', 'ar' => 'فهم صلع النمط الذكوري', 'fr' => 'Comprendre la calvitie masculine', 'ru' => 'Понимание облысения по мужскому типу'],
                    'subtitle' => ['en' => 'The Root Cause', 'ar' => 'السبب الجذري', 'fr' => 'La Cause Profonde', 'ru' => 'Коренная Причина'],
                    'description' => [
                        'en' => 'Male pattern baldness affects millions of men worldwide, typically caused by genetics and hormonal changes. Understanding the root cause is the first step in our specialized approach, allowing us to formulate a personalized hair restoration strategy that perfectly matches your natural growth pattern.',
                        'ar' => 'يؤثر صلع النمط الذكوري على ملايين الرجال حول العالم، والذي ينتج عادة عن عوامل جينية وتغيرات هرمونية. إن فهم السبب الجذري هو الخطوة الأولى في نهجنا المتخصص، مما يتيح لنا صياغة استراتيجية مخصصة لاستعادة الشعر تتطابق تمامًا مع نمط النمو الطبيعي لديك.',
                        'fr' => 'La calvitie masculine touche des millions d\'hommes dans le monde, généralement causée par des facteurs génétiques et des changements hormonaux. Comprendre la cause profonde est la première étape de notre approche spécialisée.',
                        'ru' => 'Облысение по мужскому типу поражает миллионы мужчин во всем мире, обычно оно вызвано генетическими и гормональными изменениями. Понимание первопричины - это первый шаг в нашем специализированном подходе.'
                    ]
                ],
                [
                    'title' => ['en' => 'Targeted Solutions for Men', 'ar' => 'حلول موجهة للرجال', 'fr' => 'Solutions ciblées pour hommes', 'ru' => 'Целенаправленные решения для мужчин'],
                    'subtitle' => ['en' => 'Custom Design', 'ar' => 'تصميم مخصص', 'fr' => 'Conception Personnalisée', 'ru' => 'Индивидуальный Дизайн'],
                    'description' => [
                        'en' => 'Our advanced transplantation techniques are specifically tailored for male hair characteristics. We focus on natural hairline recreation and maximizing density in thinning areas, ensuring that the results seamlessly blend with your existing hair for an undetectable finish.',
                        'ar' => 'تقنيات الزراعة المتقدمة لدينا مصممة خصيصًا لخصائص شعر الذكور. نحن نركز على إعادة إنشاء خط الشعر الطبيعي وزيادة الكثافة في المناطق الرقيقة، مما يضمن اندماج النتائج بسلاسة مع شعرك الحالي للحصول على لمسة نهائية لا يمكن اكتشافها.',
                        'fr' => 'Nos techniques de transplantation avancées sont spécialement adaptées aux caractéristiques capillaires masculines. Nous nous concentrons sur la recréation de la ligne de croissance naturelle et la maximisation de la densité.',
                        'ru' => 'Наши передовые методы трансплантации специально адаптированы к характеристикам мужских волос. Мы уделяем особое внимание воссозданию естественной линии роста волос и максимальной густоте в редеющих участках.'
                    ]
                ],
                [
                    'title' => ['en' => 'The Procedure Process', 'ar' => 'عملية الإجراء', 'fr' => 'Le Processus de l\'Intervention', 'ru' => 'Процесс Процедуры'],
                    'subtitle' => ['en' => 'Step-by-Step', 'ar' => 'خطوة بخطوة', 'fr' => 'Étape par Étape', 'ru' => 'Шаг за Шагом'],
                    'description' => [
                        'en' => 'The procedure is performed under local anesthesia, ensuring complete comfort. Using FUE or DHI methods, individual follicles are meticulously extracted and implanted at precise angles and depths. You can relax, watch a movie, or sleep while our team works.',
                        'ar' => 'يتم الإجراء تحت التخدير الموضعي، مما يضمن الراحة التامة. باستخدام طرق FUE أو DHI، يتم استخراج البصيلات الفردية بدقة وزرعها بزوايا وأعماق دقيقة. يمكنك الاسترخاء أو مشاهدة فيلم أو النوم بينما يعمل فريقنا.',
                        'fr' => 'L\'intervention est réalisée sous anesthésie locale, assurant un confort total. En utilisant les méthodes FUE ou DHI, les follicules individuels sont méticuleusement extraits et implantés à des angles et profondeurs précis.',
                        'ru' => 'Процедура проводится под местной анестезией, обеспечивая полный комфорт. С помощью методов FUE или DHI отдельные фолликулы тщательно извлекаются и имплантируются под точными углами и на точную глубину.'
                    ]
                ],
                [
                    'title' => ['en' => 'Expected Results & Recovery', 'ar' => 'النتائج المتوقعة والتعافي', 'fr' => 'Résultats Attendus et Récupération', 'ru' => 'Ожидаемые Результаты и Восстановление'],
                    'subtitle' => ['en' => 'Long-term Outlook', 'ar' => 'نظرة طويلة الأمد', 'fr' => 'Perspectives à Long Terme', 'ru' => 'Долгосрочная Перспектива'],
                    'description' => [
                        'en' => 'Recovery is swift, with most patients returning to normal activities within a few days. Initial growth is visible within 3-4 months, and full, natural-looking results are achieved within a year. We provide comprehensive aftercare to safeguard your investment.',
                        'ar' => 'التعافي سريع، ويعود معظم المرضى إلى أنشطتهم الطبيعية في غضون أيام قليلة. يظهر النمو الأولي في غضون 3-4 أشهر، ويتم تحقيق نتائج كاملة طبيعية المظهر في غضون عام. نحن نقدم رعاية لاحقة شاملة لحماية استثمارك.',
                        'fr' => 'La récupération est rapide, la plupart des patients reprenant leurs activités normales en quelques jours. La croissance initiale est visible dans les 3-4 mois, et des résultats complets et naturels sont obtenus en un an.',
                        'ru' => 'Восстановление проходит быстро, большинство пациентов возвращаются к нормальной жизни в течение нескольких дней. Первоначальный рост заметен в течение 3-4 месяцев, а полные, естественно выглядящие результаты достигаются в течение года.'
                    ]
                ]
            ]
        ]);
    }
}
