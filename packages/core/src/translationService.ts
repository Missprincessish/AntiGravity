/**
 * Language / translation layer used only when the user's app language is NOT English.
 * When the user chooses English, this layer is skipped to avoid unnecessary processing
 * and possible data corruption from an extra bot pass.
 */

const API_KEY = process.env.GEMINI_API_KEY;

/** Names used in translation prompts; order follows US Census top languages. Chinese has both Mandarin and Cantonese. */
const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    zh: 'Mandarin Chinese',
    yue: 'Cantonese Chinese',
    tl: 'Tagalog',
    vi: 'Vietnamese',
    ar: 'Arabic',
    fr: 'French',
    ko: 'Korean',
    pt: 'Portuguese',
    hi: 'Hindi',
    ht: 'Haitian Creole',
    ru: 'Russian',
    de: 'German',
    pl: 'Polish',
    ja: 'Japanese',
};

function getLanguageName(code: string): string {
    return LANGUAGE_NAMES[code] || LANGUAGE_NAMES[code.slice(0, 2)] || code;
}

/**
 * Returns true if the language bot (translation) should be used.
 * When false, the app passes text through without translation to avoid extra processing.
 */
export function shouldUseLanguageBot(userLanguage: string): boolean {
    const normalized = (userLanguage || 'en').toLowerCase();
    return normalized !== 'en';
}

/**
 * Translate user input FROM the user's language TO English for Kai.
 * If userLanguage is 'en', returns text unchanged (no API call).
 */
export async function translateToEnglish(
    text: string,
    userLanguage: string
): Promise<string> {
    const normalized = (userLanguage || 'en').toLowerCase();
    if (normalized === 'en') return text;

    if (!API_KEY) {
        console.warn('[Translation] GEMINI_API_KEY not set; passing text through.');
        return text;
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const fromLang = getLanguageName(normalized) || normalized;
    const prompt = `You are a translator. Translate the following text from ${fromLang} into English.
Output ONLY the English translation, no explanations, no quotes, no preamble. Preserve meaning and tone.`;

    try {
        const result = await model.generateContent(`${prompt}\n\n---\n\n${text}`);
        const response = await result.response;
        const translated = response.text()?.trim() ?? text;
        return translated || text;
    } catch (err) {
        console.error('[Translation] translateToEnglish failed:', err);
        return text;
    }
}

/**
 * Translate Kai's reply FROM English TO the user's language.
 * If userLanguage is 'en', returns text unchanged (no API call).
 */
export async function translateFromEnglish(
    text: string,
    userLanguage: string
): Promise<string> {
    const normalized = (userLanguage || 'en').toLowerCase();
    if (normalized === 'en') return text;

    if (!API_KEY) {
        console.warn('[Translation] GEMINI_API_KEY not set; passing text through.');
        return text;
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const toLang = getLanguageName(normalized) || normalized;
    const prompt = `You are a translator. Translate the following text from English into ${toLang}.
Output ONLY the ${toLang} translation, no explanations, no quotes, no preamble. Preserve meaning and tone.`;

    try {
        const result = await model.generateContent(`${prompt}\n\n---\n\n${text}`);
        const response = await result.response;
        const translated = response.text()?.trim() ?? text;
        return translated || text;
    } catch (err) {
        console.error('[Translation] translateFromEnglish failed:', err);
        return text;
    }
}

/**
 * Top 15 languages spoken in the United States (U.S. Census Bureau ACS 2017–2021).
 * Chinese is offered as both Mandarin and Cantonese.
 */
export const SUPPORTED_LANGUAGES: { code: string; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文 (Mandarin)' },
    { code: 'yue', name: '粵語 (Cantonese)' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
    { code: 'ko', name: '한국어' },
    { code: 'pt', name: 'Português' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ht', name: 'Kreyòl ayisyen' },
    { code: 'ru', name: 'Русский' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pl', name: 'Polski' },
    { code: 'ja', name: '日本語' },
];
