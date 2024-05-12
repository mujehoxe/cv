import { populateCountries } from "../utils/countries";
import { WorkExperience } from "../utils/formDataExtraction";
import { originalLanguage } from "../utils/languages";
import {
  elementTranslationsRendererFor,
  renderEmptyInputDivsForAllLanguages,
} from "./translationsRenderer";
import { CVProfileData } from "../utils/formDataExtraction";
import { extractDateFrom } from "../utils/dateExtraction";

export function initWorkExperienceFields() {
  const addWorkExperienceButton = document.getElementById(
    "add-work-experience"
  )!;

  addWorkExperienceButton.addEventListener("click", (e) => {
    e.preventDefault();
    renderWorkExperienceFields();
  });
}

export function renderWorkExperiencesForm() {
  const workExperiences = document.getElementById("work-experiences");
  workExperiences!.innerHTML = `
  <div id='work-experiences-form'>
    <details>
      <summary class="text-base font-semibold leading-6 text-white cursor-pointer">Expériences Professionnele</summary>
      <div id="work-experiences-container" class="px-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 pt-4">
      </div>
      <button type="button" id="add-work-experience" 
        class="rounded-md bg-indigo-500 p-2 my-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200">
      + Ajouter une expérience de travail</button>
    </details>
  </div>
  `;

  initWorkExperienceFields();
}

export function renderWorkExperienceFields() {
  const workExperiencesContainer = document.getElementById(
    "work-experiences-container"
  )!;

  const workExperience = document.createElement("div");
  workExperience.classList.add(
    "sm:col-span-2",
    "border-b",
    "py-4",
    "border-white/10"
  );

  workExperience.innerHTML = `
  <details>
    <summary class="text-base font-semibold leading-6 text-white cursor-pointer flex justify-between items-center">
      <span>
        Expérience Professionnelle
        <span id="work-experience-name" class="font-normal"></span>
      </span>
      <button type="button"
          name="delete"
          class="text-sm font-medium text-red-300 bg-transparent border border-white/10 p-2 rounded-md hover:bg-white/10 hover:text-red-700 transition-colors duration-200" 
      >
        <i class="fa-solid fa-trash"></i>
      </button>
    </summary>
    <div class="work-experience flex flex-col">
        <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
          <div class="sm:col-span-2">
            <label for="occupation-${originalLanguage.short}" class="block text-sm font-medium leading-6 text-white">Occupation ou poste tenue</label>
            <div class="mt-2 mx-2">
              <label class="text-xs font-medium text-white"
                >${originalLanguage.long}</label
              >
              <div
                contenteditable="true"
                id="occupation-${originalLanguage.short}"
                name="street-address"
                class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              ></div>
              <div id="occupation-other-langs" class="mt-2"></div>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="employer-${originalLanguage.short}" class="block text-sm font-medium leading-6 text-white">Employeur</label>
            <div class="mt-2 mx-2">
              <label class="text-xs font-medium text-white"
                >${originalLanguage.long}</label
              >
              <div
                contenteditable="true"
                id="employer-${originalLanguage.short}"
                name="street-address"
                class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              ></div>
              <div id="employer-other-langs" class="mt-2"></div>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="work-city" class="block text-sm font-medium leading-6 text-white">Ville</label>
            <input type="text" name="work-city" id="work-city" class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" placeholder="Enter the city where you work">
          </div>
          <div class="sm:col-span-2">
            <label for="work-country" class="block text-sm font-medium leading-6 text-white">Pays</label>
            <select name="work-country" id="work-country"
              class="p-2 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
              <option disabled>Selectioner</option>
            </select>
          </div>

          <div class="sm:col-span-2 mx-2">
            <label for="from-date" class="block text-sm font-medium leading-6 text-white">À Partir du</label>
            <div id="from-date" class="mt-2 flex gap-x-8">
              <div>
                <label class="text-xs" for="day">Day</label>
                <input 
                  type="number"
                  id="day"
                  min="1" max="31"
                  placeholder="DD"
                  class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
              </div>
              <div>
                <label class="text-xs" for="month">Month</label>
                <input 
                  type="number"
                  id="month"
                  min="1" max="12"
                  placeholder="MM"
                  class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
              </div>
              <div>
                <label class="text-xs" for="year">Year</label>
                <input 
                  type="number"
                  id="year"
                  min="1800" max="3000"
                  placeholder="YYYY"
                  class="p-2 block w-28 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
              </div>
            </div>
          </div>

          <div class="sm:col-span-2 mx-2">
            <label for="to-date" class="block text-sm font-medium leading-6 text-white">Jusqu'à</label>
            <div id="to-date" class="mt-2 flex gap-x-8">
              <div>
                <label class="text-xs" for="day">Day</label>
                <input 
                  type="number"
                  id="day"
                  min="1" max="31"
                  placeholder="DD"
                  class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
              </div>
              <div>
                <label class="text-xs" for="month">Month</label>
                <input 
                  type="number"
                  id="month"
                  min="1" max="12"
                  placeholder="MM"
                  class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
              </div>
              <div>
                <label class="text-xs" for="year">Year</label>
                <input 
                  type="number"
                  id="year"
                  min="1800" max="3000"
                  placeholder="YYYY"
                  class="p-2 block w-28 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
              </div>
            </div>
          </div>
          
          <div class="sm:col-span-2">
            <label for="main-activities" class="block text-sm font-medium leading-6 text-white">Activités et responsabilités principales</label>
            <div class="mt-2 mx-2">
              <label class='text-xs font-medium text-white'>${originalLanguage.long}</label>
              <div id="activities-${originalLanguage.short}"
                contentEditable
                class="p-2 block text-white w-full h-max min-h-20 rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
              </div>
              <div id="activities-other-langs" class="mt-2"></div>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="ongoing" class="text-sm font-medium leading-6 text-white mr-2">En cours?</label>
            <input type="checkbox" name="ongoing" id="ongoing" class="align-middle" style="transform: scale(1.5);">
          </div>
        </div>
    </div>
  </details>
	`;

  workExperiencesContainer.appendChild(workExperience);

  const deleteWorkExperienceButton = workExperience.querySelector(
    'button[name="delete"]'
  )!;

  deleteWorkExperienceButton.addEventListener("click", (e) => {
    e.preventDefault();
    workExperience.remove();
  });

  const occupation = workExperience.querySelector(
    `#occupation-${originalLanguage.short}`
  ) as HTMLInputElement;

  elementTranslationsRendererFor(occupation, true);

  const employer = workExperience.querySelector(
    `#employer-${originalLanguage.short}`
  ) as HTMLInputElement;

  employer.addEventListener("blur", () => {
    if (employer.innerText != "")
      renderEmptyInputDivsForAllLanguages(employer, true);
  });

  const workCountry = workExperience.querySelector(
    'select[name="work-country"]'
  ) as HTMLSelectElement;
  const workExperienceName = workExperience.querySelector(
    'span[id="work-experience-name"]'
  ) as HTMLSpanElement;

  occupation.addEventListener("input", updateWorkExperienceName);
  employer.addEventListener("input", updateWorkExperienceName);
  workCountry.addEventListener("input", updateWorkExperienceName);

  function updateWorkExperienceName() {
    let name = "";
    if (occupation.innerText != "") {
      name += occupation.innerText;
      if (employer.innerText != "")
        name += ` at <span class='font-bold'>${employer.innerText}</span>`;
      if (workCountry.value != "")
        name +=
          " in (" + workCountry.options[workCountry.selectedIndex].text + ")";
      workExperienceName.innerHTML = name;
    }
  }

  const activites = workExperience.querySelector(
    `#activities-${originalLanguage.short}`
  ) as HTMLDivElement;
  console.log(activites);

  elementTranslationsRendererFor(activites, false);

  populateCountries(workCountry);
}

function extractWorkExperienceData(
  language: string,
  workExperience: Element
): WorkExperience {
  const occupation = (
    workExperience.querySelector(`#occupation-${language}`) as HTMLInputElement
  ).value;
  const employer = (
    workExperience.querySelector(`#employer-${language}`) as HTMLInputElement
  ).value;
  const city = (workExperience.querySelector("#work-city") as HTMLInputElement)
    .value;
  const country = (
    workExperience.querySelector("#work-country") as HTMLInputElement
  ).value;

  const startDateDiv = workExperience.querySelector(
    "#from-date"
  ) as HTMLInputElement;
  const startDate = extractDateFrom(startDateDiv);

  const endDateDiv = workExperience.querySelector(
    "#to-date"
  ) as HTMLInputElement;
  const endDate = extractDateFrom(endDateDiv);

  const mainActivities = (
    workExperience?.querySelector(`#activities-${language}`) as HTMLDivElement
  )?.innerText;
  const ongoing = (workExperience.querySelector("#ongoing") as HTMLInputElement)
    .checked;

  const activities = `<ul><li>${mainActivities?.trim()}</li></ul>`.replace(
    /(?:\r\n|\r|\n)/g,
    "</li><li>"
  );

  return {
    occupation: {
      label: occupation,
      uri: null,
    },
    employer,
    startDate,
    ongoing,
    mainActivities: activities,
    organisationAddress: {
      city,
      country,
    },
    endDate,
  };
}

export function extractWorkExperiencesInto(
  data: CVProfileData,
  language: string
) {
  const workExperienceContainer = document.getElementById(
    "work-experiences-container"
  )!;
  const workExperiences =
    workExperienceContainer.querySelectorAll(".work-experience");

  if (workExperiences.length > 0) {
    data.profile.preference.profileStructure.push("work-experience");
  }

  workExperiences.forEach((workExperience) => {
    const workExperienceData = extractWorkExperienceData(
      language,
      workExperience
    );
    data.profile.workExperiences = data.profile.workExperiences || [];
    data.profile.workExperiences.push(workExperienceData);
  });
}
