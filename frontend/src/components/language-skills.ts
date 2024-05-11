import {
  CVProfileData,
  LanguageSkill,
  NonNativeLang,
} from "../utils/formDataExtraction";
import { allLanguages } from "../utils/languages";

export function renderLanguageSkillsForm() {
  const languageSkillsContainer = document.getElementById("language-skills");
  if (!languageSkillsContainer) return;

  const selectedLanguages = new Set();

  function updateLanguageOptions() {
    const options = Object.entries(allLanguages)
      .filter(([key]) => !selectedLanguages.has(key))
      .map(
        ([key, language]) => `<option value="${key}">${language.long}</option>`
      )
      .join("");
    return options;
  }

  languageSkillsContainer.innerHTML = `
<details>
    <summary class="text-base font-semibold text-white cursor-pointer">Compétences Linguistiques</summary>
    <div>
      <label
        for="motherTongue"
        class="block text-sm font-medium leading-6 text-white"
        >Langue maternelle</label
      >
      <select
        name="motherTongue"
        class="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="" hidden selected disabled>Select a language</option>
        ${updateLanguageOptions()}
      </select>
    </div>
    <div class="mt-4">
      <label
        for="other-language-skills"
        class="block text-sm font-medium leading-6 text-white"
        >Autre(s) langue(s)</label
      >
      <div id="other-language-skills-list"></div>
      <button
        type="button"
        id="add-language-skill"
        class="rounded-md bg-indigo-500 p-2 my-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200"
      >+ Ajouter d'Autre Compétence</button>
    </div>
</details>
  `;

  const motherLanguageSelect = languageSkillsContainer.querySelector(
    'select[name="motherTongue"]'
  );
  motherLanguageSelect?.addEventListener("change", handleSelectChange());

  function handleSelectChange(): EventListenerOrEventListenerObject {
    return (event: Event) => {
      const target = event.target as HTMLSelectElement;
      const previousLanguage = target.dataset.previousValue;
      if (previousLanguage) {
        selectedLanguages.delete(previousLanguage);
      }
      const selectedLanguage = (event.target as HTMLInputElement).value;
      selectedLanguages.add(selectedLanguage);
      updateLanguageOptions();
      target.dataset.previousValue = selectedLanguage;
    };
  }

  document
    .getElementById("add-language-skill")
    ?.addEventListener("click", () => {
      const list = document.getElementById("other-language-skills-list");
      if (!list) return;

      const newSkill = document.createElement("div");
      newSkill.innerHTML = `
        <div class="mb-4 mx-2 border border-gray-700 bg-zinc-800 mt-2 rounded-md p-2">
          <div class="flex justify-end">
            <button type="button"
              name='delete'
              class="text-sm text-right font-medium text-red-300 bg-transparent border border-white/10 p-2 rounded-md hover:bg-white/10 hover:text-red-700 transition-colors duration-200">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div class="mx-2">
            <label class="mt-2 text-xs">Language</label>
            <select name="language" class="text-sm mb-2 block w-full text-gray-700 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="" hidden selected disabled>Sélectionner une Langue</option>
              ${updateLanguageOptions()}
            </select>
          </div>
        </div>
			`;
      list.appendChild(newSkill);

      const newLanguageSelect = newSkill.querySelector(
        'select[name="language"]'
      ) as HTMLSelectElement;
      newLanguageSelect?.addEventListener("change", handleSelectChange());

      newSkill
        .querySelector('button[name="delete"]')
        ?.addEventListener("click", () => {
          selectedLanguages.delete(newLanguageSelect.value);
          newSkill.remove();
        });

      function createLevelsSelectElementFor(labelStr: string) {
        const label = document.createElement("label");
        label.classList.add("capitalize", "text-xs");
        label.innerHTML = labelStr;
        newLanguageSelect?.parentElement?.appendChild(label);
        const select = document.createElement("select");
        select.name = labelStr;
        select.classList.add(
          ..."block text-sm mb-2 w-full text-gray-700 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50".split(
            " "
          )
        );
        select.innerHTML =
          [`<option value="" selected hidden>Sélectionner un niveau</option>`] +
          languageLevels
            .map((option) => `<option value="${option}">${option}</option>`)
            .join("");
        newLanguageSelect?.parentElement?.appendChild(select);
      }

      createLevelsSelectElementFor("listening");
      createLevelsSelectElementFor("reading");
      createLevelsSelectElementFor("spoken interaction");
      createLevelsSelectElementFor("spoken production");
      createLevelsSelectElementFor("writing");
    });
}

const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

function extractNativeLanguagesData(): LanguageSkill[] {
  const nativeLanguage = (
    document.querySelector('select[name="motherTongue"]') as HTMLSelectElement
  ).value;

  if (nativeLanguage == "") return [];

  const language = {
    language: nativeLanguage.toUpperCase(),
    languageCategory: "NORMAL",
  };

  if (nativeLanguage == "kabyle") language.languageCategory = "FREE_TEXT";

  return [language];
}

function extractOtherLanguagesData(): NonNativeLang[] {
  const languageSkillsContainer = document.getElementById(
    "other-language-skills-list"
  );
  if (!languageSkillsContainer) return [];

  const otherLanguages = Array.from(languageSkillsContainer.children)
    .map((skill) => {
      const languageSelect = skill.querySelector(
        'select[name="language"]'
      ) as HTMLSelectElement;
      if (languageSelect.value == "") return undefined;

      const listeningSelect = skill.querySelector(
        'select[name="listening"]'
      ) as HTMLSelectElement;
      const readingSelect = skill.querySelector(
        'select[name="reading"]'
      ) as HTMLSelectElement;
      const spokenInteractionSelect = skill.querySelector(
        'select[name="spoken interaction"]'
      ) as HTMLSelectElement;
      const spokenProductionSelect = skill.querySelector(
        'select[name="spoken production"]'
      ) as HTMLSelectElement;
      const writingSelect = skill.querySelector(
        'select[name="writing"]'
      ) as HTMLSelectElement;

      return {
        language: languageSelect.value,
        listening: listeningSelect.value,
        reading: readingSelect.value,
        spokenInteraction: spokenInteractionSelect.value,
        spokenProduction: spokenProductionSelect.value,
        writing: writingSelect.value,
        languageCategory: "NORMAL",
      };
    })
    .filter((item): item is NonNativeLang => Boolean(item));

  return otherLanguages;
}

export function extractLanguageSkillsData(data: CVProfileData) {
  const nativeLanguages = extractNativeLanguagesData();
  const otherLanguages = extractOtherLanguagesData();

  if (nativeLanguages.length > 0 || otherLanguages.length > 0) {
    data.profile.preference.profileStructure.push("language");
  }

  data.profile.languageSkills = {
    nativeLanguages,
    otherLanguages,
  };
}
