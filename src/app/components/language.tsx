"use client";
import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { copy, isLocale, type Copy, type Locale } from "@/lib/copy";
const Language = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: "en", setLocale: () => {} });
function subscribe(callback: () => void) { window.addEventListener("storage", callback); window.addEventListener("scoutboard-language", callback); return () => { window.removeEventListener("storage", callback); window.removeEventListener("scoutboard-language", callback); }; }
function snapshot(): Locale { try { const value = localStorage.getItem("scoutboard-language"); return isLocale(value) ? value : "en"; } catch { return "en"; } }
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribe, snapshot, () => "en");
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  function change(value: Locale) { try { localStorage.setItem("scoutboard-language", value); window.dispatchEvent(new Event("scoutboard-language")); } catch { /* Storage may be disabled by the browser. */ } }
  return <Language.Provider value={{ locale, setLocale: change }}>{children}</Language.Provider>;
}
export function useLanguage() { return useContext(Language); }
export function T({ text }: { text: Copy }) { const { locale } = useLanguage(); return <>{text[locale]}</>; }
export function LocalizedContent({ en, ja, es }: { en: React.ReactNode; ja: React.ReactNode; es: React.ReactNode }) { const { locale } = useLanguage(); return <>{({ en, ja, es })[locale]}</>; }
export function LanguageControl() { const { locale, setLocale } = useLanguage(); return <fieldset className="languageControl"><legend>Language / 言語 / Idioma</legend>{(["en", "ja", "es"] as const).map(value => <label key={value}><input type="radio" name="language" checked={locale === value} onChange={() => setLocale(value)} />{value === "ja" ? "日本語" : value === "es" ? "Español" : "English"}</label>)}</fieldset>; }
export { copy };
