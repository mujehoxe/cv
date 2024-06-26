import { CreateCVProfile, FetchCVAndSave } from "../../wailsjs/go/main/App";
import { populateCountries, populatePhoneExtentions } from "../utils/countries";
import { renderPreviewPdf, showCvsPreviewSlideOver } from "./cvs-preview";
import { renderError } from "./error";
import { extractProfileInfo } from "../utils/formDataExtraction";
import { elementTranslationsRendererFor } from "./translationsRenderer";
import { formLanguages, originalLanguage } from "../utils/languages";
import { renderWorkExperiencesForm } from "./work-experience";
import { renderEducationTrainingsForm } from "./education-tranings";
import { renderDrivingLicencesForm } from "./driving-licences";
import { renderLanguageSkillsForm } from "./language-skills";
import { renderDigitalSkillsForm } from "./digital-skills";
import {
  removeLoadingIndicator,
  renderLoadingIndicator,
} from "./loadingIndicator";
import { renderHobbiesForm } from "./hobbies";
import { renderOtherSectionForm } from "./other-section";

async function handleSubmit(e: SubmitEvent) {
  e.preventDefault();
  const loadingDiv = document.getElementById("loading") as HTMLElement;
  renderLoadingIndicator(loadingDiv);

  document.body.style.cursor = "progress";
  const cvs = new Map();

  for (const language in formLanguages) {
    const data = extractProfileInfo(language);
    try {
      const profileId = await CreateCVProfile(JSON.stringify(data));
      const cvPath = await FetchCVAndSave(profileId, language);
      if (cvs.get(language) !== cvPath) {
        cvs.set(language, cvPath);
        renderPreviewPdf(cvPath, language);
      }
    } catch (err) {
      console.error(err);
      renderError(err as string);
    }
    showCvsPreviewSlideOver();
  }
  document.body.style.cursor = "default";
  removeLoadingIndicator(loadingDiv);
}

export function renderUserInfoForm() {
  document.querySelector("#info-form-container")!.innerHTML = `
<form id="info-form">
  <details open>
    <summary
      class="text-lg pb-8 font-semibold leading-6 text-white cursor-pointer"
    >Informations sur l'utilisateur
    </summary>
    <div class="border-b border-white/10 pb-4">
      <div class="col-span-full">
        <label
          for="photo"
          class="block text-sm font-medium leading-6 text-white"
          >Photo</label
        >
        <div class="mt-2 flex items-center gap-x-3">
          <i id="profile-icon"
            class="fa-solid fa-circle-user text-5xl h-12 w-12 text-gray-500"></i>
          <div id="preview" hidden class="relative">
            <img id="preview-img" class="h-12 w-12 rounded-full object-cover"></img>
            <i id="remove-photo-btn" class="fa-regular absolute bottom-0 right-0 fa-times text-red-500 hover:text-red-700"></i>
          </div>
          <input
            id="photo-input"
            type="file"
            class="hidden"
            accept=".jpg,.jpeg,.png"
          />
          <button
            id="photo-btn"
            type="button"
            class="rounded-md  px-3 py-2  font-semibold text-white shadow-sm hover:bg-white/20"
          >
            Changer
          </button>
        </div>
      </div>
    </div>

    <div class="border-b mt-4 border-white/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-white">
        Informations Personnelles
      </h2>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label
            for="first-name"
            class="block text-sm font-medium leading-6 text-white"
          >
            Prénom
            <span class="text-red-500">*</span>
          </label>
          <div class="mt-2">
            <input
              type="text"
              placeholder="e.g. John"
              name="first-name"
              id="first-name"
              autocomplete="given-name"
              class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-white/20"
            />
          </div>
        </div>

        <div class="sm:col-span-3">
          <label
            for="last-name"
            class="block text-sm font-medium leading-6 text-white"
          >
            Nom
            <span class="text-red-500">*</span>
          </label>
          <div class="mt-2">
            <input type="text" placeholder="e.g. Doe" name="last-name"
            id="last-name" autocomplete="family-name" class="p-2 block w-full
            rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1
            ring-inset ring-white/10 focus:ring-2 focus:ring-inset
            focus:ring-indigo-500 sm:text-sm sm:leading-6
            placeholder:text-white/20" />
          </div>
        </div>

        <div class="col-span-full">
          <label
            for="about"
            class="block text-sm font-medium leading-6 text-white"
          >
            À propos de moi
          </label>
          <div id="about" class="mt-2 mx-2">
            <label class="text-xs font-medium text-white"
              >${originalLanguage.long}</label
            >
            <div
              id="about-${originalLanguage.short}"
              contenteditable="true"
              class="p-2 block w-full h-max min-h-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            ></div>
            <div id="about-other-langs" class="mt-2"></div>
          </div>
        </div>
        <div class="sm:col-span-4">
          <label
            for="birthday"
            class="block text-sm font-medium leading-6 text-white"
            >Date de Naissance</label
          >
          <div id="birthday" class="mt-2 mx-2 flex gap-x-8">
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

        <div class="sm:col-span-4">
          <label
            for="gender"
            class="block text-sm font-medium leading-6 text-white"
            >Sexe</label
          >
          <div class="mt-2">
            <select
              id="gender"
              name="gender"
              autocomplete="gender"
              class="p-2 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
            >
              <option value="" selected disabled hidden>
                Sélectionnez Une Valuer
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div class="sm:col-span-3">
          <label
            for="nationality"
            class="block text-sm font-medium leading-6 text-white"
            >Nationalité</label
          >
          <div class="mt-2">
            <select
              id="nationality"
              name="nationality"
              autocomplete="nationality"
              class="p-2 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
            >
              <option disabled>Selectioner</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </details>

  <details class="border-b py-4 border-white/10">
    <summary class="text-base font-semibold leading-6 text-white">Contact</summary>
    <div class="my-4 space-y-10">
      <div class="sm:col-span-4">
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-white"
          >Adresse E-mail</label
        >
        <div class="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          for="phone-number"
          class="block text-sm font-medium leading-6 text-white"
          >Numéro de téléphone 1</label
        >
        <div class="relative mt-2 rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 flex items-center">
            <label for="phone-extention" class="sr-only">Phone extention</label>
            <select
              id="phone-extention"
              name="country"
              autocomplete="country"
              class="bg-transparent h-full rounded-md border-0 py-0 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs"
            >
              <option disabled>Selectioner</option>
            </select>
          </div>
          <input
            type="text"
            name="phone-number"
            id="phone-number"
            class="p-2 block w-full rounded-md border-0 py-1.5 pl-36 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="612345678"
          />
        </div>
        <label
          for="phone-number"
          class="block text-sm font-medium leading-6 text-white"
          >Numéro de téléphone 2</label
        >
        <div class="relative mt-2 rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 flex items-center">
            <label for="phone-extention" class="sr-only">Phone extention</label>
            <select
              id="phone-extention"
              name="country"
              autocomplete="country"
              class="bg-transparent h-full rounded-md border-0 py-0 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs"
            >
              <option disabled>Selectioner</option>
            </select>
          </div>
          <input
            type="text"
            name="phone-number"
            id="phone-number"
            class="p-2 block w-full rounded-md border-0 py-1.5 pl-36 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="612345678"
          />
        </div>
      </div>
    </div>
  </details>

  <details class="border-b py-4 border-white/10">
    <summary class="text-base font-semibold leading-6 text-white">Adresse</summary>
    <div class="my-4 px-4 space-y-10">
      <div class="flex flex-col gap-y-8 col-span-full">
        <div>
          <label
            for="street-address"
            class="block text-sm font-medium leading-6 text-white"
            >Adresse de rue</label
          >
          <div id="street-addresses" class="mx-2">
            <label class="text-xs font-medium text-white"
              >${originalLanguage.long}</label
            >

            <div
              contenteditable="true"
              id="street-${originalLanguage.short}"
              name="street-address"
              class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            ></div>
            <div id="street-other-langs" class="mt-2"></div>
            <style>
              [contenteditable="true"].single-line br {
                display: none;
              }

              [contenteditable="true"].single-line * {
                display: inline;
                white-space: nowrap;
              }
            </style>
          </div>
        </div>

        <div class="sm:col-span-2 sm:col-start-1">
          <label
            for="city"
            class="block text-sm font-medium leading-6 text-white"
            >Ville</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="city"
              id="city"
              autocomplete="address-level2"
              class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="sm:col-span-2">
          <label
            for="postal-code"
            class="block text-sm font-medium leading-6 text-white"
            >ZIP / Code Postal</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="postal-code"
              id="postal-code"
              autocomplete="postal-code"
              class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="sm:col-span-3">
          <label
            for="country"
            class="block text-sm font-medium leading-6 text-white"
            >Pays</label
          >
          <div class="mt-2">
            <select
              id="country"
              name="country"
              autocomplete="country"
              class="p-2 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
            >
              <option disabled>Sélectionner</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </details>

  <div class="py-4 border-b border-white/10" id="work-experiences"></div>

  <div class="py-4 border-b border-white/10" id="education-trainings"></div>

  <div class="py-4 border-b border-white/10" id="driving-licences"></div>

  <div class="py-4 border-b border-white/10" id="language-skills"></div>

  <div class="py-4 border-b border-white/10" id="digital-skills"></div>

  <div class="py-4 border-b border-white/10" id="hobbies"></div>

  <div id="other-sections"></div>
  
  <button type="button" id="add-section"
      class="rounded-md bg-indigo-500 w-full p-4 border-2 border-dashed my-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200"
    >+ Ajouter une autre section
  </button>

  <div class="my-6 flex flex-row items-center justify-end">
    <div id="loading"></div>
    <div class="flex gap-x-6">
      <button
        type="reset"
        class="text-sm font-semibold leading-6 text-white bg-transparent border border-white/10 px-3 py-2 rounded-md hover:bg-white/10 hover:text-indigo-500 transition-colors duration-200"
      >
        Reinitialiser
      </button>
      <button
        id="submit"
        type="submit"
        class="rounded-md disabled:bg-gray-600 disabled:hover:bg-gray-600 bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200"
      >
        Envoyer
      </button>
    </div>
  </div>
</form>
`;

  const photoBtn = document.getElementById("photo-btn") as HTMLInputElement;
  photoBtn.addEventListener("click", () => {
    const photoInput = document.getElementById(
      "photo-input"
    ) as HTMLInputElement;
    photoInput.click();

    const reader = new FileReader();
    photoInput.addEventListener("change", (event) => {
      //@ts-ignore
      const file = event.target.files[0];
      if (file) {
        reader.onload = () => {
          (document.getElementById("preview-img") as HTMLImageElement).src =
            reader.result as string;
          document.getElementById("preview")!.removeAttribute("hidden");
          document
            .querySelector("#profile-icon")!
            .setAttribute("hidden", "true");
        };
        reader.readAsDataURL(file);
      }
    });
  });

  //remove photo btn clicked
  const removePhotoBtn = document.getElementById(
    "remove-photo-btn"
  ) as HTMLButtonElement;
  removePhotoBtn.addEventListener("click", () => {
    const previewImg = document.getElementById(
      "preview-img"
    ) as HTMLImageElement;
    previewImg.src = "";

    document.getElementById("profile-icon")!.removeAttribute("hidden");

    document.getElementById("preview")!.setAttribute("hidden", "true");
  });

  const nationality = document.getElementById(
    "nationality"
  ) as HTMLSelectElement;
  populateCountries(nationality);
  const countrySelect = document.getElementById("country") as HTMLSelectElement;
  populateCountries(countrySelect);

  const phoneExtentionSelects = document.querySelectorAll(
    "#phone-extention"
  ) as NodeListOf<HTMLSelectElement>;
  phoneExtentionSelects.forEach((select) => {
    populatePhoneExtentions(select);
  });

  elementTranslationsRendererFor("about", false);

  elementTranslationsRendererFor("street", true);

  renderWorkExperiencesForm();

  renderEducationTrainingsForm();

  renderDrivingLicencesForm();

  renderLanguageSkillsForm();

  renderDigitalSkillsForm();

  renderHobbiesForm();

  //add section on click
  const addSectionButton = document.getElementById(
    "add-section"
  ) as HTMLButtonElement;
  addSectionButton.addEventListener("click", () => {
    renderOtherSectionForm();
  });

  const form = document.getElementById("info-form");
  form?.addEventListener("submit", (e) => handleSubmit(e));
}
