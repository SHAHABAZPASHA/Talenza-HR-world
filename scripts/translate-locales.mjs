import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.resolve(process.cwd());
const localesDir = path.join(rootDir, 'locales');
const sourceFile = path.join(localesDir, 'en.json');
const separator = '<<<STW_SEP_7f2e>>>';
const batchSize = 14;

const languageTargets = {
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  ne: 'ne',
  nl: 'nl',
  pl: 'pl',
  pt: 'pt',
  ro: 'ro',
  ru: 'ru',
  si: 'si',
  ta: 'ta',
  zh: 'zh-CN'
};

const protectedPatterns = [
  /\{\{[^}]+\}\}/g,
  /Silvora Talenza World/g,
  /WhatsApp/g,
  /Google Maps/g,
  /PRO/g,
  /UAE/g,
  /GCC/g,
  /PDF|DOCX|DOC|PNG|JPG|JPEG|WEBP/g,
  /\+971\s?58\s?589\s?5827/g,
  /info@silvoratalenzaworld\.com/g,
  /silvoratalenzaworld\.com/g,
  /tel:\+971585895827/g,
  /https:\/\/wa\.me\/971585895827(?:\?[^\s"]+)?/g
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function protectText(input) {
  const replacements = [];
  let output = input;

  protectedPatterns.forEach((pattern) => {
    output = output.replace(pattern, (match) => {
      const token = `__STW_TOKEN_${replacements.length}__`;
      replacements.push({ token, value: match });
      return token;
    });
  });

  return { output, replacements };
}

function restoreText(input, replacements) {
  return replacements.reduce((result, entry) => {
    return result.replace(new RegExp(escapeRegex(entry.token), 'g'), entry.value);
  }, input);
}

async function translateChunk(values, targetLanguage) {
  const protectedEntries = values.map((value) => protectText(value));
  const payload = protectedEntries.map((entry) => entry.output).join(separator);
  const query = new URLSearchParams({
    client: 'gtx',
    sl: 'en',
    tl: targetLanguage,
    dt: 't',
    q: payload
  });

  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`Translation request failed with ${response.status}`);
  }

  const data = await response.json();
  const translatedPayload = Array.isArray(data[0]) ? data[0].map((segment) => segment[0]).join('') : '';
  const translatedEntries = translatedPayload.split(separator);

  if (translatedEntries.length !== values.length) {
    const fallbackResults = [];

    for (const value of values) {
      const [translatedValue] = await translateChunk([value], targetLanguage);
      fallbackResults.push(translatedValue);
    }

    return fallbackResults;
  }

  return translatedEntries.map((entry, index) => {
    return restoreText(entry.trim(), protectedEntries[index].replacements);
  });
}

async function translateLocale(fileName, targetLanguage, sourceEntries) {
  const filePath = path.join(localesDir, fileName);
  const currentLocale = JSON.parse(await fs.readFile(filePath, 'utf8'));
  const keys = Object.keys(sourceEntries).filter((key) => !(key in currentLocale) || currentLocale[key] === sourceEntries[key]);

  for (let index = 0; index < keys.length; index += batchSize) {
    const chunkKeys = keys.slice(index, index + batchSize);
    const chunkValues = chunkKeys.map((key) => sourceEntries[key]);
    const translatedValues = await translateChunk(chunkValues, targetLanguage);

    chunkKeys.forEach((key, offset) => {
      currentLocale[key] = translatedValues[offset];
    });

    console.log(`${fileName}: translated ${Math.min(index + batchSize, keys.length)}/${keys.length}`);
  }

  await fs.writeFile(filePath, `${JSON.stringify(currentLocale, null, 2)}\n`, 'utf8');
}

async function main() {
  const sourceEntries = JSON.parse(await fs.readFile(sourceFile, 'utf8'));

  for (const [fileStem, targetLanguage] of Object.entries(languageTargets)) {
    await translateLocale(`${fileStem}.json`, targetLanguage, sourceEntries);
  }

  console.log('locale translation complete');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});