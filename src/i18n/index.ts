// ============================================================
// 多言語（ja / en / zh）共通ユーティリティ
// ------------------------------------------------------------
// - 日本語ページ：/ssi/ /project/ /news/xxx/ （プレフィックスなし）
// - 英語ページ　：/en/ssi/ /en/project/ /en/news/xxx/
// - 繁体字ページ：/zh/ssi/ /zh/project/ /zh/news/xxx/
// 翻訳文は src/i18n/<page>.<lang>.json に置く。en/zh に無いキーは ja にフォールバックする。
// ============================================================

export const LANGS = ['ja', 'en', 'zh'] as const;
export type Lang = (typeof LANGS)[number];

export const HTML_LANG: Record<Lang, string> = { ja: 'ja', en: 'en', zh: 'zh-Hant' };
export const OG_LOCALE: Record<Lang, string> = { ja: 'ja_JP', en: 'en_US', zh: 'zh_TW' };
export const LANG_LABEL: Record<Lang, string> = { ja: '日本語', en: 'English', zh: '繁體中文' };
export const LANG_SHORT: Record<Lang, string> = { ja: 'JA', en: 'EN', zh: '繁體' };

/** 言語プレフィックスを付けたパスを返す（アンカーはそのまま） */
export function localePath(lang: Lang, path: string): string {
  if (!path.startsWith('/')) return path; // "#vision" や外部URLはそのまま
  if (lang === 'ja') return path;
  return `/${lang}${path === '/' ? '/' : path}`;
}

/** ページ用のリンク関数を作る */
export function makeL(lang: Lang) {
  return (path: string) => localePath(lang, path);
}

/** 辞書をマージ（en/zh に無いキーは ja を使う） */
export function mergeDict<T extends Record<string, string>>(ja: T, other: Partial<T> | undefined): T {
  return { ...ja, ...(other ?? {}) } as T;
}

// ---- 辞書の読み込み --------------------------------------------------------
import commonJa from './common.ja.json';
import commonEn from './common.en.json';
import commonZh from './common.zh.json';
import homeJa from './home.ja.json';
import homeEn from './home.en.json';
import homeZh from './home.zh.json';
import ssiJa from './ssi.ja.json';
import ssiEn from './ssi.en.json';
import ssiZh from './ssi.zh.json';
import projectJa from './project.ja.json';
import projectEn from './project.en.json';
import projectZh from './project.zh.json';
import aboutksdiJa from './aboutksdi.ja.json';
import aboutksdiEn from './aboutksdi.en.json';
import aboutksdiZh from './aboutksdi.zh.json';
import servicesJa from './services.ja.json';
import servicesEn from './services.en.json';
import servicesZh from './services.zh.json';
import contactJa from './contact.ja.json';
import contactEn from './contact.en.json';
import contactZh from './contact.zh.json';
import newsJa from './news.ja.json';
import newsEn from './news.en.json';
import newsZh from './news.zh.json';
import articleJa from './article.ja.json';
import articleEn from './article.en.json';
import articleZh from './article.zh.json';

const DICTS = {
  common: { ja: commonJa, en: commonEn, zh: commonZh },
  home: { ja: homeJa, en: homeEn, zh: homeZh },
  ssi: { ja: ssiJa, en: ssiEn, zh: ssiZh },
  project: { ja: projectJa, en: projectEn, zh: projectZh },
  aboutksdi: { ja: aboutksdiJa, en: aboutksdiEn, zh: aboutksdiZh },
  services: { ja: servicesJa, en: servicesEn, zh: servicesZh },
  contact: { ja: contactJa, en: contactEn, zh: contactZh },
  news: { ja: newsJa, en: newsEn, zh: newsZh },
  article: { ja: articleJa, en: articleEn, zh: articleZh },
} as const;

export type DictName = keyof typeof DICTS;

export function dict(name: DictName, lang: Lang): Record<string, string> {
  const d = DICTS[name] as Record<Lang, Record<string, string>>;
  return mergeDict(d.ja, d[lang]);
}

// ---- ニュース記事の多言語フィールド ------------------------------------------
export interface NewsImage { url: string; caption?: string }
export interface NewsLink { title: string; url: string; organization: string }
export interface NewsI18n {
  title?: string; description?: string; content?: string; full_content?: string;
  images?: { caption?: string }[]; links?: { title?: string; organization?: string }[];
}
export interface NewsItem {
  id: string; date: string; title: string; category: string; kaishin_related?: boolean;
  description: string; content: string; full_content?: string;
  images?: NewsImage[]; links?: NewsLink[];
  en?: NewsI18n; zh?: NewsI18n;
}

/** 記事を指定言語で返す（翻訳が無い項目は日本語のまま） */
export function localizeNews(n: NewsItem, lang: Lang): NewsItem {
  if (lang === 'ja') return n;
  const tr = n[lang];
  if (!tr) return n;
  return {
    ...n,
    title: tr.title ?? n.title,
    description: tr.description ?? n.description,
    content: tr.content ?? n.content,
    full_content: tr.full_content ?? n.full_content,
    images: n.images?.map((img, i) => ({ ...img, caption: tr.images?.[i]?.caption ?? img.caption })),
    links: n.links?.map((l, i) => ({ ...l, title: tr.links?.[i]?.title ?? l.title, organization: tr.links?.[i]?.organization ?? l.organization })),
  };
}
