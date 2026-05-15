export const DEMO_BRANDING = {
  name: { en: 'Lumo Clinic', ar: 'عيادة لومو', fr: 'Clinique Lumo', ru: 'Клиника Лумо' },
  logo: '' // Fallback to text to prevent broken image icons
};

export const DEMO_HERO = {
  title: { en: 'Redefine Your', ar: 'أعد اكتشاف', fr: 'Redéfinissez Votre', ru: 'Переопределите Свою' },
  subtitle: { en: 'True Aesthetics.', ar: 'جمالك الحقيقي.', fr: 'Véritable Beauté.', ru: 'Истинную Красоту.' },
  subheader: { 
    en: 'Elevate your confidence with world-class medical excellence and luxury concierge care in the heart of Istanbul.', 
    ar: 'ارتق بثقتك مع التميز الطبي العالمي والرعاية الفاخرة المخصصة في قلب إسطنبول.', 
    fr: 'Améliorez votre confiance avec l\'excellence médicale de classe mondiale au cœur d\'Istanbul.', 
    ru: 'Повысьте свою уверенность с мировым медицинским совершенством в самом сердце Стамбула.' 
  },
  image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2000'
};

const DUMMY_IMAGES = [
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800'
];

export const overrideTreatments = (treatments: any[]) => {
  return treatments.map((t, idx) => ({
    ...t,
    image: DUMMY_IMAGES[idx % DUMMY_IMAGES.length],
    media_url: DUMMY_IMAGES[idx % DUMMY_IMAGES.length],
    before_after_media_url: 'https://images.unsplash.com/photo-1551076805-e16060c1e120?auto=format&fit=crop&q=80&w=800',
    content_media_url: DUMMY_IMAGES[(idx + 1) % DUMMY_IMAGES.length]
  }));
};

export const overrideBlogs = (blogs: any[]) => {
  return blogs.map((b, idx) => ({
    ...b,
    image: DUMMY_IMAGES[(idx + 2) % DUMMY_IMAGES.length],
    media_url: DUMMY_IMAGES[(idx + 2) % DUMMY_IMAGES.length],
    author: { en: 'Dr. Emily Carter', ar: 'د. إيميلي كارتر', fr: 'Dr. Emily Carter', ru: 'Д-р Эмили Картер' },
    excerpt: {
      en: 'Discover the latest advancements in aesthetic medicine and how luxury concierge care is redefining patient experiences globally.',
      ar: 'اكتشف أحدث التطورات في الطب التجميلي وكيف تعيد الرعاية الفاخرة تعريف تجارب المرضى عالمياً.',
      fr: 'Découvrez les dernières avancées en médecine esthétique et comment les soins de conciergerie de luxe redéfinissent l\'expérience des patients.',
      ru: 'Откройте для себя последние достижения в эстетической медицине и как элитный консьерж-сервис переопределяет опыт пациентов в мире.'
    }
  }));
};

export const overrideDoctors = (doctors: any[]) => {
  const doctorImages = [
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1594824436998-d50d6ff71c66?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
  ];

  const doctorNames = [
    { en: 'Dr. Alexander Sterling', ar: 'د. ألكسندر ستيرلينغ', fr: 'Dr. Alexander Sterling', ru: 'Д-р Александр Стерлинг' },
    { en: 'Dr. Isabella Rossi', ar: 'د. إيزابيلا روسي', fr: 'Dr. Isabella Rossi', ru: 'Д-р Изабелла Росси' },
    { en: 'Dr. Marcus Chen', ar: 'د. ماركوس تشين', fr: 'Dr. Marcus Chen', ru: 'Д-р Маркус Чен' }
  ];

  return doctors.map((d, idx) => ({
    ...d,
    name: doctorNames[idx % doctorNames.length],
    image: doctorImages[idx % doctorImages.length],
    media_url: doctorImages[idx % doctorImages.length]
  }));
};

export const overrideTestimonials = (testimonials: any[]) => {
  const demoNames = [
    { en: 'Sarah Jenkins', ar: 'سارة جينكينز', fr: 'Sarah Jenkins', ru: 'Сара Дженкинс' },
    { en: 'Michael Thorne', ar: 'مايكل ثورن', fr: 'Michael Thorne', ru: 'Майкл Торн' },
    { en: 'Elena Rostova', ar: 'إيلينا روستوفا', fr: 'Elena Rostova', ru: 'Елена Ростова' }
  ];

  const demoFeedback = [
    { en: 'The Lumo Clinic completely redefined my expectations of medical care. The luxury concierge service was flawless from start to finish.', ar: 'لقد أعادت عيادة لومو تعريف توقعاتي للرعاية الطبية بالكامل.', fr: 'La clinique Lumo a complètement redéfini mes attentes en matière de soins médicaux.', ru: 'Клиника Lumo полностью изменила мои ожидания от медицинского обслуживания.' },
    { en: 'World-class surgeons and a facility that feels like a 5-star hotel. Truly a premium experience in Istanbul.', ar: 'جراحون عالميون ومرفق يشبه فندق 5 نجوم. تجربة ممتازة حقاً في إسطنبول.', fr: 'Des chirurgiens de classe mondiale et un établissement qui ressemble à un hôtel 5 étoiles.', ru: 'Хирурги мирового класса и учреждение, похожее на 5-звездочный отель.' },
    { en: 'I felt so cared for and pampered. The results of my treatment exceeded all my dreams. Highly recommended!', ar: 'شعرت بالكثير من الرعاية والتدليل. تجاوزت نتائج علاجي كل أحلامي.', fr: 'Je me suis sentie tellement choyée et dorlotée. Les résultats de mon traitement ont dépassé tous mes rêves.', ru: 'Я чувствовала такую заботу. Результаты моего лечения превзошли все мои мечты.' }
  ];

  return testimonials.map((t, idx) => ({
    ...t,
    name: demoNames[idx % demoNames.length],
    patient_name: demoNames[idx % demoNames.length],
    feedback: demoFeedback[idx % demoFeedback.length],
    text: demoFeedback[idx % demoFeedback.length],
    rating: 5
  }));
};

export const overrideLocations = (locations: any[]) => {
  return [
    {
      id: 1,
      name: { en: 'Lumo Clinic Nişantaşı', ar: 'عيادة لومو نيشانتاشي', fr: 'Clinique Lumo Nişantaşı', ru: 'Клиника Лумо Нишанташи' },
      address: { en: 'Nişantaşı, Istanbul, Turkey', ar: 'نيشانتاشي، إسطنبول، تركيا', fr: 'Nişantaşı, Istanbul, Turquie', ru: 'Нишанташи, Стамбул, Турция' },
      phone: '+90 555 000 0000',
      email: 'info@lumoclinic.demo',
      map_url: 'https://maps.google.com/?q=Nisantasi+Istanbul'
    },
    {
      id: 2,
      name: { en: 'Lumo Dental Studio', ar: 'استوديو لومو لطب الأسنان', fr: 'Studio Dentaire Lumo', ru: 'Стоматологическая студия Лумо' },
      address: { en: 'Beşiktaş, Istanbul, Turkey', ar: 'بشيكتاش، إسطنبول، تركيا', fr: 'Beşiktaş, Istanbul, Turquie', ru: 'Бешикташ, Стамбул, Турция' },
      phone: '+90 555 000 0001',
      email: 'dental@lumoclinic.demo',
      map_url: 'https://maps.google.com/?q=Besiktas+Istanbul'
    },
    {
      id: 3,
      name: { en: 'Lumo International Patient Lounge', ar: 'صالة مرضى لومو الدولية', fr: 'Salon International Lumo', ru: 'Международная гостиная Лумо' },
      address: { en: 'Şişli, Istanbul, Turkey', ar: 'شيشلي، إسطنبول، تركيا', fr: 'Şişli, Istanbul, Turquie', ru: 'Шишли, Стамбул, Турция' },
      phone: '+90 555 000 0002',
      email: 'international@lumoclinic.demo',
      map_url: 'https://maps.google.com/?q=Sisli+Istanbul'
    }
  ];
};

export const overrideWhatsapp = (whatsapp: any) => {
  return {
    ...whatsapp,
    number: '+905550000000',
    phoneNumber: '+90 555 000 00 00',
    message: { en: 'Hello Lumo Clinic, I would like to book a consultation.', ar: 'مرحباً عيادة لومو، أود حجز استشارة.', fr: 'Bonjour Clinique Lumo, je souhaite réserver une consultation.', ru: 'Здравствуйте, Клиника Лумо, я хотел бы записаться на консультацию.' }
  };
};

export const overrideSocialLinks = (links: any[]) => {
  return [
    { id: 1, platform: 'Facebook', url: 'https://facebook.com', is_active: 1 },
    { id: 2, platform: 'Instagram', url: 'https://instagram.com', is_active: 1 },
    { id: 3, platform: 'YouTube', url: 'https://youtube.com', is_active: 1 },
    { id: 4, platform: 'TikTok', url: 'https://tiktok.com', is_active: 1 }
  ];
};

export const overrideResults = (results: any[]) => {
  const resultBeforeImages = [
    'https://images.unsplash.com/photo-1589330680190-252187b5a1b3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1551076805-e16060c1e120?auto=format&fit=crop&q=80&w=600'
  ];
  const resultAfterImages = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600'
  ];
  
  if (!results || results.length === 0) {
    // If backend returns empty, provide fake results so demo mode isn't empty
    return [
      {
        id: 1,
        patient_name: 'Emma W.',
        treatment_id: 1,
        before_image_url: resultBeforeImages[0],
        after_image_url: resultAfterImages[0],
        description: { en: 'Exceptional smile makeover at Lumo Clinic.', ar: 'تجميل ابتسامة استثنائي في عيادة لومو.', fr: 'Relooking de sourire exceptionnel.', ru: 'Исключительное преображение улыбки в клинике Lumo.' }
      },
      {
        id: 2,
        patient_name: 'James H.',
        treatment_id: 2,
        before_image_url: resultBeforeImages[1],
        after_image_url: resultAfterImages[1],
        description: { en: 'Hair restoration journey with Lumo Clinic.', ar: 'رحلة استعادة الشعر مع عيادة لومو.', fr: 'Parcours de restauration capillaire.', ru: 'Путешествие по восстановлению волос с клиникой Lumo.' }
      }
    ];
  }

  return results.map((r, idx) => ({
    ...r,
    before_image_url: resultBeforeImages[idx % resultBeforeImages.length],
    after_image_url: resultAfterImages[idx % resultAfterImages.length],
    description: { en: 'Exceptional transformation at Lumo Clinic. The luxury concierge service was flawless.', ar: 'تحول استثنائي في عيادة لومو. خدمة الكونسيرج الفاخرة كانت خالية من العيوب.', fr: 'Transformation exceptionnelle à la Clinique Lumo.', ru: 'Исключительное преображение в клинике Lumo.' }
  }));
};

export const overrideSections = (sections: any) => {
  const newSections = { ...sections };
  if (newSections.footer_about) {
    newSections.footer_about = {
      ...newSections.footer_about,
      title: { en: 'Lumo Clinic', ar: 'عيادة لومو', fr: 'Clinique Lumo', ru: 'Клиника Лумо' },
      content: { en: 'A boutique medical concierge delivering world-class aesthetic excellence.', ar: 'كونسيرج طبي بوتيك يقدم تميزاً جمالياً عالمي المستوى.', fr: 'Une conciergerie médicale de charme offrant une excellence esthétique de classe mondiale.', ru: 'Бутик-медицинский консьерж, предлагающий эстетическое совершенство мирового класса.' }
    };
  }
  return newSections;
};
