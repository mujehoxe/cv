import { originalLanguage } from "../../utils/languages";
import { elementTranslationsRendererFor } from "../common/translationsRenderer";

let formPage: HTMLDivElement;

export function showCoverLetterForm() {
  renderForm();
  formPage.removeAttribute("hidden");
}

export function renderForm() {
  formPage = document.querySelector("#cover-letter-form")!;
  formPage.innerHTML = `
			<button id="close-cover-button" type="button" class="fixed right-4 top-4 rounded-md bg-zinc-700 text-gray-300 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
				<span class="sr-only">Close panel</span>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<div class="px-12 pt-4">
				<div class="px-12 py-4" id="info-cover-container"></div>
				<div id="cvs-preview" class="hidden"></div>
			</div>
		`;

  renderUserInfoForm();

  document
    .getElementById("close-cover-button")!
    .addEventListener("click", () => {
      hideFormPage();
    });
}

function renderUserInfoForm() {
  document.querySelector("#info-cover-container")!.innerHTML = `
<form id="info-form">
  <div>
    <div
      class="text-lg pb-8 font-semibold leading-6 text-white cursor-pointer"
    >Informations sur l'utilisateur
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
      </div>
    </div>
  </div>

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
              name="phone-extention"
              autocomplete="phone-extention"
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
              name="phone-extention"
              autocomplete="phone-extention"
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
              id="street-cover-${originalLanguage.short}"
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

	<div class="col-span-full my-4">
    <label
      for="object"
      class="block text-sm font-medium leading-6 text-white"
    >Objet</label>
    <div id="object" class="mt-2 mx-2">
      <label class="text-xs font-medium text-white"
        >${originalLanguage.long}</label>
    	<div
        id="object-${originalLanguage.short}"
        contenteditable="true"
        class="p-2 block w-full h-max min-h-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
    	></div>
    	<div id="object-other-langs" class="mt-2"></div>
    </div>
  </div>

	<div class="col-span-full my-4">
    <label
      for="content"
      class="block text-sm font-medium leading-6 text-white"
    >Contenu</label>
    <div id="content" class="mt-2 mx-2">
      <label class="text-xs font-medium text-white"
        >${originalLanguage.long}</label>
    	<div
        id="content-${originalLanguage.short}"
        contenteditable="true"
        class="p-2 block w-full h-max min-h-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
    	></div>
    	<div id="content-other-langs" class="mt-2"></div>
    </div>
  </div>

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

  const streetInput = document.getElementById(
    `street-cover-${originalLanguage.short}`
  ) as HTMLDivElement;
  elementTranslationsRendererFor(streetInput, true);

  const objectInput = document.getElementById(
    `object-${originalLanguage.short}`
  ) as HTMLDivElement;
  elementTranslationsRendererFor(objectInput, false);

  const contentInput = document.getElementById(
    `content-${originalLanguage.short}`
  ) as HTMLDivElement;
  elementTranslationsRendererFor(contentInput, false);
}

export function hideFormPage() {
  formPage.setAttribute("hidden", "true");
}
