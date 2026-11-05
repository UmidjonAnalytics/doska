import { languages } from "@excalidraw/excalidraw";
import LanguageDetector from "i18next-browser-languagedetector";

// Doska is built for Uzbek speakers: everyone starts in Uzbek (Latin script).
// The browser language is deliberately ignored; only an explicit choice
// (saved from the language menu, or `?lng=` in the URL) overrides it.
export const DOSKA_DEFAULT_LANG_CODE = "uz-UZ";

export const languageDetector = new LanguageDetector();

languageDetector.init(
  { languageUtils: {} },
  { order: ["querystring", "localStorage"], caches: ["localStorage"] },
);

export const getPreferredLanguage = () => {
  const detectedLanguages = languageDetector.detect();

  const detectedLanguage = Array.isArray(detectedLanguages)
    ? detectedLanguages[0]
    : detectedLanguages;

  return (
    (detectedLanguage
      ? languages.find((lang) => lang.code === detectedLanguage)?.code ??
        languages.find((lang) => lang.code.startsWith(detectedLanguage))?.code
      : null) || DOSKA_DEFAULT_LANG_CODE
  );
};
