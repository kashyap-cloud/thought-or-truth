import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = 'AIzaSyC0ZrBzIxWgc0jV7VGcAEcBRANoJVsSTiw';
const targetLanguages = [
  'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh-CN', 'ja', 'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl'
];

const sourceFile = path.join(__dirname, '../src/locales/en.json');
const outputDir = path.join(__dirname, '../src/locales');

const sourceContent = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

export async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  
  try {
    const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      q: text,
      target: targetLang,
      source: 'en'
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error.response ? error.response.data : error.message);
    return text;
  }
}

export async function translateObject(obj, targetLang) {
  if (Array.isArray(obj)) {
    const newArr = [];
    for (const item of obj) {
      newArr.push(await translateObject(item, targetLang));
    }
    return newArr;
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = await translateObject(obj[key], targetLang);
    }
    return newObj;
  } else if (typeof obj === 'string') {
    // Skip placeholder markers like {{score}}
    const placeholders = obj.match(/\{\{.*?\}\}/g) || [];
    let textToTranslate = obj;
    placeholders.forEach((p, i) => {
      textToTranslate = textToTranslate.replace(p, `__P${i}__`);
    });
    
    let translated = await translateText(textToTranslate, targetLang);
    
    placeholders.forEach((p, i) => {
      translated = translated.replace(`__P${i}__`, p);
    });
    
    return translated;
  }
  return obj;
}

async function run() {
  for (const lang of targetLanguages) {
    console.log(`Translating to ${lang}...`);
    const translatedContent = await translateObject(sourceContent, lang);
    const outputPath = path.join(outputDir, `${lang}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translatedContent, null, 2), 'utf8');
    console.log(`Saved ${lang}.json`);
  }
}

run();
