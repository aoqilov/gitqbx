import { useState, useEffect } from "react";
import ru from "./ru.json";
import uz from "./uz.json";
import kr from "./kr.json";

/* ───────────────── Types ───────────────── */

type Lang = "ru" | "uz" | "kr";

const LANGUAGE_KEY = "app_language";

const translations: Record<Lang, any> = {
  ru,
  uz,
  kr,
};

/* ───────────────── Global State ───────────────── */

let currentLang: Lang = (localStorage.getItem(LANGUAGE_KEY) as Lang) || "ru";

const subscribers = new Set<() => void>();

function notifyAll() {
  subscribers.forEach((cb) => cb());
}

function setGlobalLang(lang: Lang) {
  currentLang = lang;
  localStorage.setItem(LANGUAGE_KEY, lang);
  notifyAll();
}

/* ───────────────── Helpers ───────────────── */

function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function interpolate(
  template: string,
  params?: Record<string, string | number>,
) {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key]?.toString() ?? `{${key}}`;
  });
}

/* ───────────────── Hook ───────────────── */

export function useTranslation(prefix = "") {
  const [, rerender] = useState(0);

  useEffect(() => {
    const trigger = () => rerender((n) => n + 1);

    subscribers.add(trigger);
    return () => {
      subscribers.delete(trigger);
    };
  }, []);

  function t(key: string, params?: Record<string, string | number>): string {
    const fullKey = prefix + key;

    const text =
      getNestedValue(translations[currentLang], fullKey) ??
      getNestedValue(translations["ru"], fullKey) ??
      fullKey;

    return interpolate(text, params);
  }

  return {
    t,
    lang: currentLang,
    changeLanguage: setGlobalLang,
  };
}
