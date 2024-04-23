export type Language = {
  short: string;
  long: string;
};
export type Languages = {
  [key: string]: Language;
};

export const languages: Languages = {
  EN: { short: "EN", long: "English" },
  FR: { short: "FR", long: "French" },
  DE: { short: "DE", long: "German" },
  ES: { short: "ES", long: "Spanish" },
};

export let originalLanguage: Language = { short: "FR", long: "French" };

export function setOriginalLanguage(language: Language) {
  originalLanguage = language;
}
