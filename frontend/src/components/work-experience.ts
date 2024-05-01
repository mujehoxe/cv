import { populateCountries } from "./countries";
import { WorkExperience } from "./formDataExtraction";
import { originalLanguage } from "./languages";
import Quill from "quill";
import { translationsRendererForQuill } from "./translationsRenderer";
import { CVProfileData } from "./formDataExtraction";
import Toolbar from "quill/modules/toolbar";

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
      <summary class="text-base font-semibold leading-6 text-white cursor-pointer">Work Experiences</summary>
      <div id="work-experiences-container" class="px-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 pt-4">
      </div>
      <button type="button" id="add-work-experience" 
        class="rounded-md bg-indigo-500 p-2 my-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200">
      + Add Work Experience</button>
    </details>
  <div>
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
        Work Experience
        <span id="work-experience-name" class="font-normal"></span>
      </span>
      <button type="button" 
          name='delete'
          class="text-sm font-medium text-red-300 bg-transparent border border-white/10 p-2 rounded-md hover:bg-white/10 hover:text-red-700 transition-colors duration-200" 
      >
        <i class="fa-solid fa-trash"></i>
      </button>
    </summary>
    <div class="work-experience flex flex-col">
        <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
          <div class="sm:col-span-2">
            <label for="occupation" class="block text-sm font-medium leading-6 text-white">Occupation or position held</label>
            <input type="text" name="occupation" id="occupation" class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" placeholder="Enter your occupation or position">
          </div>
          <div class="sm:col-span-2">
            <label for="employer" class="block text-sm font-medium leading-6 text-white">Employer</label>
            <input type="text" name="employer" id="employer" class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" placeholder="Enter your employer">
          </div>
          <div class="sm:col-span-2">
            <label for="work-city" class="block text-sm font-medium leading-6 text-white">City</label>
            <input type="text" name="work-city" id="work-city" class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" placeholder="Enter the city where you work">
          </div>
          <div class="sm:col-span-2">
            <label for="work-country" class="block text-sm font-medium leading-6 text-white">Country</label>
            <select name="work-country" id="work-country"
              class="p-2 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
              <option disabled>Select</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label for="from-date" class="block text-sm font-medium leading-6 text-white">From</label>
            <input type="date" name="from-date" id="from-date" class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
          </div>
          <div class="sm:col-span-2">
            <label for="to-date" class="block text-sm font-medium leading-6 text-white">To</label>
            <input type="date" name="to-date" id="to-date" class="mt-2 p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
          </div>
          
          <div class="sm:col-span-2">
            <label for="main-activities" class="block text-sm font-medium leading-6 text-white">Main activities and responsibilities</label>
            <div class="mt-2 mx-2">
              <label class='text-xs font-medium text-white'>${originalLanguage.long}</label>
              <div id="activities-${originalLanguage.short}"
                class="p-2 block w-full h-max min-h-20 rounded-b-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
              </div>
              <div id="activities-other-langs" class="mt-2"></div>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="ongoing" class="text-sm font-medium leading-6 text-white mr-2">Ongoing?</label>
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
    'input[name="occupation"]'
  ) as HTMLInputElement;
  const employer = workExperience.querySelector(
    'input[name="employer"]'
  ) as HTMLInputElement;
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
    if (occupation.value != "") {
      name += occupation.value;
      if (employer.value != "")
        name += ` at <span class='font-bold'>${employer.value}</span>`;
      if (workCountry.value != "")
        name +=
          " in (" + workCountry.options[workCountry.selectedIndex].text + ")";
    }
    workExperienceName.innerHTML = name;
  }

  const activites = workExperience.querySelector(
    `#activities-${originalLanguage.short}`
  ) as HTMLDivElement;

  const quill = new Quill(activites, {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    },
  });

  const toolbar = quill.getModule("toolbar") as Toolbar;
  toolbar.container?.classList.add("rounded-t-md", "bg-slate-300");

  translationsRendererForQuill("activities", quill);

  populateCountries(workCountry);
}

function extractWorkExperienceData(
  language: string,
  workExperience: Element
): WorkExperience {
  const occupation = (
    workExperience.querySelector("#occupation") as HTMLInputElement
  ).value;
  const employer = (
    workExperience.querySelector("#employer") as HTMLInputElement
  ).value;
  const city = (workExperience.querySelector("#work-city") as HTMLInputElement)
    .value;
  const country = (
    workExperience.querySelector("#work-country") as HTMLInputElement
  ).value;
  const startDate = (
    workExperience.querySelector("#from-date") as HTMLInputElement
  ).value;
  const endDate = (workExperience.querySelector("#to-date") as HTMLInputElement)
    .value;
  const activitiesContainer = workExperience.querySelector(
    `#activities-${language}`
  ) as HTMLDivElement;
  const mainActivities = (
    activitiesContainer.querySelector(".ql-editor") as HTMLDivElement
  ).innerHTML;

  const ongoing = (workExperience.querySelector("#ongoing") as HTMLInputElement)
    .checked;

  return {
    occupation: {
      label: occupation,
      uri: null,
    },
    employer,
    startDate: startDate
      ? {
          date: startDate,
          dateType: "DAY",
        }
      : null,
    ongoing,
    mainActivities,
    organisationAddress: {
      city,
      country,
    },
    endDate: endDate
      ? {
          date: endDate,
          dateType: "DAY",
        }
      : null,
  };
}

export function extractWorkExperiencesInto(
  language: string,
  data: CVProfileData
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
