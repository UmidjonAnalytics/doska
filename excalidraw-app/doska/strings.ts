import { useI18n } from "@excalidraw/excalidraw/i18n";

// App-only strings for Doska (boards). Kept out of the editor's locale
// files so the upstream translation files stay mergeable.

const en = {
  myBoards: "My boards",
  newBoard: "New board",
  boardN: "Board {n}",
  deleteBoard: "Delete board",
  deleteBoardConfirm: "Delete “{name}”? This can't be undone.",
};

type Strings = typeof en;

const uzLatn: Strings = {
  myBoards: "Doskalarim",
  newBoard: "Yangi doska",
  boardN: "Doska {n}",
  deleteBoard: "Doskani oʻchirish",
  deleteBoardConfirm: "«{name}» oʻchirilsinmi? Buni qaytarib boʻlmaydi.",
};

const uzCyrl: Strings = {
  myBoards: "Доскаларим",
  newBoard: "Янги доска",
  boardN: "Доска {n}",
  deleteBoard: "Доскани ўчириш",
  deleteBoardConfirm: "«{name}» ўчирилсинми? Буни қайтариб бўлмайди.",
};

const STRINGS: Record<string, Strings> = {
  en,
  "uz-UZ": uzLatn,
  "uz-Cyrl-UZ": uzCyrl,
};

const fill = (text: string, vars?: Record<string, string | number>) =>
  vars
    ? text.replace(/\{(\w+)\}/g, (match, key) =>
        key in vars ? String(vars[key]) : match,
      )
    : text;

export const getDoskaStrings = (langCode: string) =>
  STRINGS[langCode] ?? STRINGS.en;

export const useDoskaT = () => {
  const { langCode } = useI18n();
  const strings = getDoskaStrings(langCode);
  return {
    dt: (key: keyof Strings, vars?: Record<string, string | number>) =>
      fill(strings[key], vars),
    langCode,
  };
};
