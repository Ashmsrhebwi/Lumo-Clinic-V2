
import fs from 'fs';
import path from 'path';

const filePath = 'c:/Users/Shahm.s/Desktop/Gravity Clinic/app/context/LanguageContext.tsx';
const content = fs.readFileSync(filePath, 'utf-8');

// Simple regex to find keys in the translations object
// Matches 'key': 'value' or "key": "value"
const keyRegex = /['"]([^'"]+)['"]\s*:/g;

const languageSections = ['en', 'fr', 'ru', 'ar'];
const duplicates = {};

languageSections.forEach(lang => {
    const langStart = content.indexOf(`${lang}: {`);
    if (langStart === -1) return;
    
    // Find matching bracket for the language object
    let depth = 0;
    let langContent = '';
    for (let i = langStart + lang.length + 2; i < content.length; i++) {
        if (content[i] === '{') depth++;
        if (content[i] === '}') {
            if (depth === 0) break;
            depth--;
        }
        langContent += content[i];
    }

    const keys = [];
    let match;
    while ((match = keyRegex.exec(langContent)) !== null) {
        keys.push(match[1]);
    }

    const seen = new Set();
    const langDuplicates = [];
    keys.forEach(key => {
        if (seen.has(key)) {
            langDuplicates.push(key);
        }
        seen.add(key);
    });

    if (langDuplicates.length > 0) {
        duplicates[lang] = langDuplicates;
    }
});

console.log('Duplicate keys found:', JSON.stringify(duplicates, null, 2));
