import { useI18n } from "@excalidraw/excalidraw/i18n";

import { PRO_PRICE } from "./config";

// App-only strings for Doska (boards + Pro). Kept out of the editor's locale
// files so the upstream translation files stay mergeable.

const en = {
  myBoards: "My boards",
  newBoard: "New board",
  boardN: "Board {n}",
  pro: "Doska Pro",
  proBadge: "PRO",
  upgrade: "Upgrade to Pro",
  proTitle: "Doska Pro",
  limitReached:
    "The free plan includes {limit} board. Upgrade to Pro to create more.",
  proPitch: "Everything in Free, plus:",
  featureUnlimited: "Unlimited boards",
  featureSwitch: "Switch between boards in one click",
  featureSupport: "Support the development of Doska",
  freePlan: "Free",
  freePlanDesc: "{limit} board",
  currentPlan: "Current plan",
  comingSoon: "Payments are coming soon",
  close: "Not now",
  deleteBoard: "Delete board",
  deleteBoardConfirm: "Delete “{name}”? This can't be undone.",
  youArePro: "You're on Doska Pro",
};

type Strings = typeof en;

const uzLatn: Strings = {
  myBoards: "Doskalarim",
  newBoard: "Yangi doska",
  boardN: "Doska {n}",
  pro: "Doska Pro",
  proBadge: "PRO",
  upgrade: "Proʼga oʻtish",
  proTitle: "Doska Pro",
  limitReached:
    "Bepul tarifda {limit} ta doska mavjud. Koʻproq doska yaratish uchun Proʼga oʻting.",
  proPitch: "Bepul tarifdagi hamma narsa, qoʻshimcha ravishda:",
  featureUnlimited: "Cheksiz doskalar",
  featureSwitch: "Doskalar oʻrtasida bir bosishda almashish",
  featureSupport: "Doska rivojiga hissa qoʻshasiz",
  freePlan: "Bepul",
  freePlanDesc: "{limit} ta doska",
  currentPlan: "Joriy tarif",
  comingSoon: "Toʻlov tez orada ishga tushadi",
  close: "Hozir emas",
  deleteBoard: "Doskani oʻchirish",
  deleteBoardConfirm: "«{name}» oʻchirilsinmi? Buni qaytarib boʻlmaydi.",
  youArePro: "Siz Doska Pro foydalanuvchisisiz",
};

const uzCyrl: Strings = {
  myBoards: "Доскаларим",
  newBoard: "Янги доска",
  boardN: "Доска {n}",
  pro: "Doska Pro",
  proBadge: "PRO",
  upgrade: "Proʼга ўтиш",
  proTitle: "Doska Pro",
  limitReached:
    "Бепул тарифда {limit} та доска мавжуд. Кўпроқ доска яратиш учун Proʼга ўтинг.",
  proPitch: "Бепул тарифдаги ҳамма нарса, қўшимча равишда:",
  featureUnlimited: "Чексиз доскалар",
  featureSwitch: "Доскалар ўртасида бир босишда алмашиш",
  featureSupport: "Doska ривожига ҳисса қўшасиз",
  freePlan: "Бепул",
  freePlanDesc: "{limit} та доска",
  currentPlan: "Жорий тариф",
  comingSoon: "Тўлов тез орада ишга тушади",
  close: "Ҳозир эмас",
  deleteBoard: "Доскани ўчириш",
  deleteBoardConfirm: "«{name}» ўчирилсинми? Буни қайтариб бўлмайди.",
  youArePro: "Сиз Doska Pro фойдаланувчисисиз",
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
  const price = PRO_PRICE[langCode as keyof typeof PRO_PRICE] ?? PRO_PRICE.en;
  return {
    dt: (key: keyof Strings, vars?: Record<string, string | number>) =>
      fill(strings[key], vars),
    price,
    langCode,
  };
};
