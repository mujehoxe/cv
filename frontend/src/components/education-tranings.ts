import { populateCountries } from "./countries";
import { EducationTraining } from "./formDataExtraction";
import { originalLanguage } from "./languages";
import { elementTranslationsRendererFor } from "./translationsRenderer";
import { CVProfileData } from "./formDataExtraction";

function initEducationTrainingFields() {
  const addEducationTrainingButton = document.getElementById(
    "add-education-training"
  )!;

  addEducationTrainingButton.addEventListener("click", (e) => {
    e.preventDefault();
    renderEducationTrainingFields();
  });
}

export function renderEducationTrainingsForm() {
  const educationTrainings = document.getElementById("education-trainings");
  educationTrainings!.innerHTML = `
  <div id='education-trainings-form'>
     <details>
       <summary class="text-base font-semibold leading-6 text-white cursor-pointer">Education and Training</summary>
       <div id="education-trainings-container" class="px-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 pt-4">
       </div>
       <button type="button" id="add-education-training" 
         class="rounded-md bg-indigo-500 p-2 my-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200">
       + Add Education and Training</button>
     </details>
  <div>
  `;

  initEducationTrainingFields();
}

function renderEducationTrainingFields() {
  const educationTrainingsContainer = document.getElementById(
    "education-trainings-container"
  )!;

  const educationTraining = document.createElement("div");
  educationTraining.classList.add(
    "sm:col-span-2",
    "border-b",
    "py-4",
    "border-white/10"
  );

  educationTraining.innerHTML = `
<details>
  <summary
    class="text-base font-semibold leading-6 text-white cursor-pointer flex justify-between items-center"
  >
    <span>
      Education and Training
      <span id="education-training-name" class="font-normal"></span>
    </span>
    <button
      type="button"
      name="delete"
      class="text-sm font-medium text-red-300 bg-transparent border border-white/10 p-2 rounded-md hover:bg-white/10 hover:text-red-700 transition-colors duration-200"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  </summary>
  <div class="education-training flex flex-col">
    <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
      <div class="sm:col-span-2">
        <label
          for="degree-container"
          class="block text-sm font-medium leading-6 text-white">Degree or Certification</label>
        <div id="degree-container" class="mt-2 mx-2">
          <label for="degree" class="text-xs font-medium text-white">${originalLanguage.long}</label>
          <div
            contenteditable="true"
            name="degree"
            id="degree-${originalLanguage.short}"
            class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          ></div>
          <div id="degree-other-langs" class="mt-2"></div>
        </div>
      </div>
      <div class="sm:col-span-2">
        <label
          for="institution-container"
          class="block text-sm font-medium leading-6 text-white"
          >Institution</label
        >
        <div id="institution-container" class="mt-2 mx-2">
          <label for="institution" class="text-xs font-medium text-white">${originalLanguage.long}</label>
          <div
            contenteditable="true"
            name="institution"
            id="institution-${originalLanguage.short}"
            class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          ></div>
          <div id="institution-other-langs" class="mt-2"></div>
        </div>
      </div>
      <div class="sm:col-span-2">
        <label
          for="education-city"
          class="block text-sm font-medium leading-6 text-white"
          >City</label
        >
        <input
          type="text"
          name="education-city"
          id="education-city"
          class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          placeholder="Enter the city of the institution"
        />
      </div>
      <div class="sm:col-span-2">
        <label
          for="education-country"
          class="block text-sm font-medium leading-6 text-white"
          >Country</label
        >
        <select
          name="education-country"
          id="education-country"
          class="p-2 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
        >
          <option disabled>Select</option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label
          for="from-date"
          class="block text-sm font-medium leading-6 text-white"
          >From</label
        >
        <input
          type="date"
          name="from-date"
          id="from-date"
          class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
        />
      </div>
      <div class="sm:col-span-2">
        <label
          for="to-date"
          class="block text-sm font-medium leading-6 text-white"
          >To</label
        >
        <input
          type="date"
          name="to-date"
          id="to-date"
          class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
        />
      </div>
      <div class="sm:col-span-2">
        <label
          for="study-field"
          class="block text-sm font-medium leading-6 text-white"
          >Field of study</label
        >
        <div id="study-field" name="study-field" class="mt-2 mx-2">
          <label class="text-xs font-medium text-white"
            >${originalLanguage.long}</label
          >
          <div
            contenteditable="true"
            id="study-field-${originalLanguage.short}"
            class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          ></div>
          <div id="study-field-other-langs" class="mt-2"></div>
        </div>
      </div>
    </div>
  </div>
</details>
`;

  educationTrainingsContainer.appendChild(educationTraining);

  const deleteEducationTrainingButton = educationTraining.querySelector(
    'button[name="delete"]'
  )!;
  deleteEducationTrainingButton.addEventListener("click", (e) => {
    e.preventDefault();
    educationTraining.remove();
  });

  const degree = educationTraining.querySelector(
    `div[name="degree"]`
  ) as HTMLDivElement;
  const institution = educationTraining.querySelector(
    'div[name="institution"]'
  ) as HTMLDivElement;
  const educationCountry = educationTraining.querySelector(
    'select[name="education-country"]'
  ) as HTMLSelectElement;
  const educationTrainingName = educationTraining.querySelector(
    'span[id="education-training-name"]'
  ) as HTMLSpanElement;

  degree.addEventListener("input", updateEducationTrainingName);
  institution.addEventListener("input", updateEducationTrainingName);
  educationCountry.addEventListener("input", updateEducationTrainingName);

  function updateEducationTrainingName() {
    let name = "";
    if (degree.innerText != "") {
      name += degree.innerText;
      if (institution.innerText != "")
        name += ` at <span class='font-bold'>${institution.innerText}</span>`;
      if (educationCountry.value != "")
        name +=
          " in (" +
          educationCountry.options[educationCountry.selectedIndex].text +
          ")";
    }
    educationTrainingName.innerHTML = name;
  }

  elementTranslationsRendererFor(degree, true);

  elementTranslationsRendererFor(institution, true);

  const studyField = educationTraining.querySelector(
    `#study-field-${originalLanguage.short}`
  ) as HTMLDivElement;

  elementTranslationsRendererFor(studyField, true);

  populateCountries(educationCountry);
}

function extractEducationTrainingData(
  language: string,
  educationTraining: Element
): EducationTraining {
  const qualification = (
    educationTraining.querySelector(`#degree-${language}`) as HTMLDivElement
  )?.innerText;
  const organisationName = (
    educationTraining.querySelector(
      `#institution-${language}`
    ) as HTMLInputElement
  )?.innerText;
  const city = (
    educationTraining.querySelector("#education-city") as HTMLInputElement
  ).value;
  const country = (
    educationTraining.querySelector("#education-country") as HTMLSelectElement
  ).value;
  const startDate = (
    educationTraining.querySelector("#from-date") as HTMLInputElement
  ).value;
  const endDate = (
    educationTraining.querySelector("#to-date") as HTMLInputElement
  ).value;

  const ongoing = endDate === "" && startDate !== "";

  const studyField =
    (educationTraining.querySelector(
      `#study-field-${language}`
    ) as HTMLDivElement) || null;

  return {
    qualification,
    organisationName,
    city,
    country,
    startDate: startDate
      ? {
          date: startDate,
          dateType: "DAY",
        }
      : null,
    endDate: endDate
      ? {
          date: endDate,
          dateType: "DAY",
        }
      : null,
    ongoing,
    studyFields: studyField
      ? [
          {
            content: studyField.innerText,
            studyFieldCategoryType: "freeText",
          },
        ]
      : [],
  };
}

export function extractEducationTrainingsInto(
  language: string,
  data: CVProfileData
) {
  const educationTrainingContainer = document.getElementById(
    "education-trainings-container"
  )!;
  const educationTrainings = educationTrainingContainer.querySelectorAll(
    ".education-training"
  );

  if (educationTrainings.length > 0) {
    data.profile.preference.profileStructure.push("education-training");
  }

  educationTrainings.forEach((educationTraining) => {
    const educationTrainingData = extractEducationTrainingData(
      language,
      educationTraining
    );
    data.profile.educationTrainings = data.profile.educationTrainings || [];
    data.profile.educationTrainings.push(educationTrainingData);
  });
}