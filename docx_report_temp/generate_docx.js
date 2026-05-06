const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

async function createDocx() {
  try {
    const imgDir = __dirname;
    const images = [
      { path: 'homepage_1773776717195.png', title: '1. Homepage (Hero & Main Section)', desc: 'The homepage features a striking hero section with high-quality imagery and clear calls to action. It sets a professional tone and immediately communicates the clinic\'s core value proposition.' },
      { path: 'dental_1773776733554.png', title: '2. Dental Services Page', desc: 'A dedicated page for dental treatments, showcasing services with clean layouts and easy-to-read information.' },
      { path: 'hair_1773776762018.png', title: '3. Hair Transplant Page', desc: 'The hair restoration page focuses on advanced techniques and natural results, designed to build trust with potential patients.' },
      { path: 'booking_1773776776685.png', title: '4. Online Booking System', desc: 'A streamlined, step-by-step booking process that makes it easy for patients to schedule their consultations.' },
      { path: 'contact_1773776789357.png', title: '5. Contact & Support', desc: 'A clear and accessible contact page with multiple ways to reach out, ensuring a smooth communication channel for clients.' }
    ];

    const children = [
      new Paragraph({
        text: 'Gravity Clinic - Initial Review Report',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: '', spacing: { after: 200 } }),
      new Paragraph({ text: 'Section 1: Introduction', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({
        text: 'This report provides an initial preview of the newly redesigned Gravity Clinic website. The project focuses on creating a premium, professional, and user-friendly digital presence that reflects the clinic\'s high standards of medical care. The new design is built with modern technologies (React, Tailwind CSS, and Framer Motion) to ensure high performance and smooth interactions.',
      }),
      new Paragraph({ text: '', spacing: { after: 200 } }),
      new Paragraph({ text: 'Section 2: Screenshots Preview', heading: HeadingLevel.HEADING_1 }),
    ];

    for (const img of images) {
      children.push(new Paragraph({ text: img.title, heading: HeadingLevel.HEADING_2 }));
      children.push(new Paragraph({ text: img.desc }));
      
      const fullPath = path.join(imgDir, img.path);
      if (fs.existsSync(fullPath)) {
        const image = new ImageRun({
          data: fs.readFileSync(fullPath),
          transformation: {
            width: 600,
            height: 300,
          },
        });
        children.push(new Paragraph({ children: [image], alignment: AlignmentType.CENTER }));
      } else {
        children.push(new Paragraph({ text: `[Image Not Found: ${img.path}]`, color: 'FF0000' }));
      }
      children.push(new Paragraph({ text: '', spacing: { after: 100 } }));
    }

    children.push(new Paragraph({ text: 'Section 3: Key Features', heading: HeadingLevel.HEADING_1 }));
    [
      'Modern Design: A clean, premium aesthetic that aligns with global healthcare standards.',
      'Multi-language Support: Fully localized for English, Arabic, French, and Russian.',
      'Responsive Layout: Perfect viewing experience on desktops, tablets, and smartphones.',
      'Smooth Animations: Subtle micro-interactions and transitions for a premium feel.',
      'Improved UI/UX: Simplified navigation and intuitive user flows.'
    ].forEach(feature => {
      children.push(new Paragraph({ text: feature, bullet: { level: 0 } }));
    });

    children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    children.push(new Paragraph({ text: 'Section 4: Improvements Made', heading: HeadingLevel.HEADING_1 }));
    [
      'Better Layout and Spacing: Optimized use of white space to improve content hierarchy and focus.',
      'Improved Colors and Readability: A curated color palette that enhances brand identity and ensures accessibility.',
      'Enhanced Navigation: A more logical and accessible menu structure.',
      'Added Animations and Interactivity: Engaging elements that make the website feel alive and responsive.'
    ].forEach(improvement => {
      children.push(new Paragraph({ text: improvement, bullet: { level: 0 } }));
    });

    children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    children.push(new Paragraph({ text: 'Section 5: Notes for Client', heading: HeadingLevel.HEADING_1 }));
    [
      'This is an initial version designed for your early feedback.',
      'We are open to adjustments regarding colors, imagery, or specific wording.',
      'The final version will include further performance optimizations and secondary page refinements.'
    ].forEach(note => {
      children.push(new Paragraph({ text: note, bullet: { level: 0 } }));
    });

    children.push(new Paragraph({ text: '', spacing: { after: 400 } }));
    children.push(new Paragraph({
      text: 'We look forward to your feedback!',
      alignment: AlignmentType.CENTER,
      bold: true
    }));

    const doc = new Document({
      sections: [{ children }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(__dirname, 'Gravity_Clinic_Initial_Review_Report.docx'), buffer);
    console.log('DOCX created successfully!');

  } catch (err) {
    console.error('Error creating DOCX:', err);
    process.exit(1);
  }
}

createDocx();
