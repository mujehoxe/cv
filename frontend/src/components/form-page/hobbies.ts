import { Hobby } from "../../utils/formDataExtraction";
import { originalLanguage } from "../../utils/languages";
import {
  elementTranslationsRendererFor,
  renderEmptyInputDivsForAllLanguages,
} from "./translationsRenderer";
import { CVProfileData } from "../../utils/formDataExtraction";

function initEducationTrainingFields() {
  const addEducationTrainingButton = document.getElementById("add-hobby")!;

  addEducationTrainingButton.addEventListener("click", (e) => {
    e.preventDefault();
    renderHobbyFields();
  });
}

export function renderHobbiesForm() {
  const hobbies = document.getElementById("hobbies");
  hobbies!.innerHTML = `
  <div id='hobbies-form'>
     <details>
       <summary class="text-base font-semibold leading-6 text-white cursor-pointer">Les Loisir et Centres d'Intérêt</summary>
       <div id="hobbies-container" class="px-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 pt-4">
       </div>
       <button type="button" id="add-hobby"
         class="rounded-md bg-indigo-500 p-2 my-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200">
       + Ajouter une Loisir ou Intérêt</button>
     </details>
  </div>
  `;

  initEducationTrainingFields();
}

function renderHobbyFields() {
  const hobbiesContainer = document.getElementById("hobbies-container")!;

  const hobby = document.createElement("div");
  hobby.classList.add("sm:col-span-2", "border-b", "py-4", "border-white/10");

  hobby.innerHTML = `
<div>
  <div class="hobby flex flex-col">
    <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
      <div class="sm:col-span-2">
        <div class="flex justify-between">
          <label
            for="hobby-name-container"
            class="block text-sm font-medium leading-6 text-white">Intitulé de Loisir ou Centre d'Intérêt</label>
          <button
            type="button"
            name="delete"
            class="text-sm font-medium text-red-300 bg-transparent border border-white/10 p-2 rounded-md hover:bg-white/10 hover:text-red-700 transition-colors duration-200"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div id="hobby-name-container" class="mt-2 mx-2">
          <label for="hobby-name" class="text-xs font-medium text-white">${originalLanguage.long}</label>
          <div
            contenteditable="true"
            name="hobby-name"
            id="hobby-name-${originalLanguage.short}"
            class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          ></div>
          <div id="hobby-name-other-langs" class="mt-2"></div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

  hobbiesContainer.appendChild(hobby);

  const deleteEducationTrainingButton = hobby.querySelector(
    'button[name="delete"]'
  )!;
  deleteEducationTrainingButton.addEventListener("click", (e) => {
    e.preventDefault();
    hobby.remove();
  });

  const hobbyName = hobby.querySelector(
    `div[name="hobby-name"]`
  ) as HTMLDivElement;

  elementTranslationsRendererFor(hobbyName, true);
}

function extractHobbyData(language: string, hobby: Element): Hobby {
  const hobbyName = (
    hobby.querySelector(`#hobby-name-${language}`) as HTMLDivElement
  )?.innerText;

  return {
    title: hobbyName,
  };
}

export function extractHobbiesInto(data: CVProfileData, language: string) {
  const hobbiesContainer = document.getElementById("hobbies-container")!;
  const hobbies = hobbiesContainer.querySelectorAll(".hobby");

  data.profile.hobbiesInterests = [];

  hobbies.forEach((hobby) => {
    const hobbyData = extractHobbyData(language, hobby);
    data.profile.hobbiesInterests?.push(hobbyData);
  });

  if (hobbies.length > 0) {
    if (
      !data.profile.preference.profileStructure.includes("hobbies-interests")
    ) {
      data.profile.preference.profileStructure.push("hobbies-interests");
    }
  }
}

export function fillHobbies(profiles: CVProfileData[]) {
  const hobbies = profiles[0].profile.hobbiesInterests;
  if (!hobbies || !hobbies.length) {
    return;
  }

  for (const _ of hobbies) {
    renderHobbyFields();
  }

  const hobbiesContainer = document.getElementById("hobbies-container")!;
  const hobbiesDivs = hobbiesContainer.querySelectorAll(".hobby");

  hobbiesDivs.forEach((hobbyDiv, index) => {
    const hobbyName = hobbyDiv.querySelector(
      `#hobby-name-${originalLanguage.short}`
    ) as HTMLDivElement;
    renderEmptyInputDivsForAllLanguages(hobbyName, true);

    for (const p of profiles) {
      if (!p.profile?.hobbiesInterests || !p.profile.hobbiesInterests[index])
        return;

      (hobbyDiv.querySelector(
        `#hobby-name-${p.profile.language}`
      ) as HTMLDivElement)!.innerHTML =
        p.profile?.hobbiesInterests[index].title;
    }

    if (profiles[0].errors) hobbyName.dispatchEvent(new CustomEvent("blur"));
  });
}
