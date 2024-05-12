export type Language = {
  short: string;
  long: string;
};
export type Languages = {
  [key: string]: Language;
};

export const formLanguages: Languages = {
  EN: { short: "EN", long: "English" },
  FR: { short: "FR", long: "French" },
  DE: { short: "DE", long: "German" },
  ES: { short: "ES", long: "Spanish" },
};

export const allLanguages: Languages = {
  eng: { short: "EN", long: "English" },
  ara: { short: "AR", long: "Arabic" },
  fre: { short: "FR", long: "French" },
  ber: { short: "BER", long: "Berber" },
  Kabyle: { short: "Kabyle", long: "Kabyle" },
  ger: { short: "DE", long: "German" },
  spa: { short: "ES", long: "Spanish" },
  tur: { short: "TR", long: "Turkish" },
  rus: { short: "RU", long: "Russian" },
  chi: { short: "ZH", long: "Chinese" },
  ita: { short: "IT", long: "Italian" },
  dut: { short: "NL", long: "Dutch" },
};

export let originalLanguage: Language = { short: "FR", long: "French" };

export function setOriginalLanguage(language: Language) {
  originalLanguage = language;
}

export function renderFormLanguages() {
  const languagesContainer = document.getElementById(
    "form-languages-containter"
  ) as HTMLElement;
  languagesContainer.innerHTML = `
  <div class="flex flex-row gap-4 justify-center items-center mt-4 w-1/3 min-w-64 m-auto">
      <label for="language" class="text-sm font-medium leading-6 text-white">Language</label>
      <select id="language-select" name="language" autocomplete="language"
        class="p-2 w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
      </select>
  </div>
  `;

  const languageSelect = document.getElementById("language-select")!;
  languageSelect.innerHTML = generateLanguageOptions(formLanguages);
  languageSelect?.addEventListener("change", (e) => {
    setOriginalLanguage(formLanguages[(e.target as HTMLSelectElement).value]);
  });
}

function generateLanguageOptions(languages: Languages) {
  // prettier-ignore
  return Object.entries(languages).map(
      ([key, language]) => 
        `<option ${language.short === originalLanguage.short ? 'selected="selected"' : ''} value="${key}">
          ${language.long}
        </option>`
  ).join("");
}
