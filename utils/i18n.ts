export const getApiLocale = (l: string) => {
    const map: Record<string, string> = {
        zh: "zh-CN",
        en: "en-US",
        ja: "ja-JP",
        ko: "ko-KR"
    };
    return map[l] || l;
};

export const getLangName = (lang: string) => {
    const map: Record<string, string> = {
        'zh-CN': '简体中文',
        'en-US': 'English',
        'ja-JP': '日本語',
        'ko-KR': '한국어'
    };
    return map[lang] || lang;
};