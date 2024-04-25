import { FetchCV } from "../wailsjs/go/main/App";
import { populateNationalities, populatePhoneExtentions } from "./countries";
import { renderPreviewPdf, showCvsPreviewSlideOver } from "./cvs-preview";
import { renderError } from "./error";
import { extractFormData } from "./formDataExtraction";
import { elementTranslationsRenderer } from "./translationsRenderer";
import {
  languages,
  originalLanguage,
  setOriginalLanguage,
  Languages,
} from "./languages";

function handleSubmit(e: Event) {
  e.preventDefault();
  const cvs = new Map();
  showCvsPreviewSlideOver();
  for (const language in languages) {
    const data = extractFormData(language);
    try {
      FetchCV(JSON.stringify(data))
        .then((result) => {
          if (cvs.get(language) !== result) {
            cvs.set(language, result);
            renderPreviewPdf(result, language);
          }
        })
        .catch((err) => {
          console.error(err);
          renderError(err);
        });
    } catch (err) {
      console.error(err);
    }
  }
}

export function renderForm() {
  document.querySelector("#form")!.innerHTML = `
<form id="form">
	<div class="space-y-12">

		<div class="border-b border-white/10 pb-12">
				<div class="col-span-full">
					<label for="photo" class="block text-sm font-medium leading-6 text-white">Photo</label>
					<div class="mt-2 flex items-center gap-x-3">
						<svg class="h-12 w-12 text-gray-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
						</svg>
						<button type="button" class="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20">Change</button>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-row gap-4 justify-center items-center mt-4 w-1/3 min-w-64 m-auto">
			<label for="language" class="text-sm font-medium leading-6 text-white">Language</label>
			<select id="language-select" name="language" autocomplete="language" class="p-2 w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
			</select>
		</div>
		<div class="border-b mt-4 border-white/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-white">Personal Information</h2>
			<p class="mt-1 text-sm leading-6 text-gray-400">Use a permanent address where you can receive mail.</p>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-3">
					<label for="first-name" class="block text-sm font-medium leading-6 text-white">
						First name
						<span class="text-red-500">*</span>
					</label>
					<div class="mt-2">
						<input type="text" placeholder="e.g. John" name="first-name" id="first-name" autocomplete="given-name" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="last-name" class="block text-sm font-medium leading-6 text-white">
						Last name
						<span class="text-red-500">*</span>
					</label>
					<div class="mt-2">
						<input type="text" placeholder="e.g. Doe" name="last-name" id="last-name" autocomplete="family-name" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
					</div>
				</div>

				<div class="col-span-full">
					<label for="about" class="block text-sm font-medium leading-6 text-white">
						About me
					</label>
					<div id='about' class="mt-2">
            <label class='text-xs font-medium text-white'>${originalLanguage.long}</about>
						<div
							id="about-${originalLanguage.short}"
							rows="3"
							contenteditable="true"
							class="p-2 block w-full h-max min-h-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
						</div>
						<div id="about-other-langs" class="mt-2"></div>
					</div>
				</div>
				<div class="sm:col-span-4">
					<label for="birthday" class="block text-sm font-medium leading-6 text-white">Date of birth</label>
					<div class="mt-2">
						<input id="birthday" name="birthday" type="date" autocomplete="birthday" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
					</div>
				</div>

				<div class="sm:col-span-4">
					<label for="gender" class="block text-sm font-medium leading-6 text-white">Gender</label>
					<div class="mt-2">
						<select id="gender" name="gender" autocomplete="gender" class="p-2 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
							<option value"" selected disabled hidden>Select from list</option>
							<option value="male">Male</option>
							<option vlaue="female">Female</option>
						</select>
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="nationality" class="block text-sm font-medium leading-6 text-white">Nationality</label>
					<div class="mt-2">
						<select id="nationality" name="nationality" autocomplete="nationality" class="p-2 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
							<option disabled>Select</option>
						</select>
					</div>
				</div>				
			</div>
		</div>

		<div class="border-b mt-4 border-white/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-white">Contact</h2>

			<div class="mt-10 space-y-10">
				<div class="sm:col-span-4">
						<label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
						<div class="mt-2">
							<input id="email" name="email" type="email" autocomplete="email" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
						</div>
				</div>


        <div>
          <label for="phone-number" class="block text-sm font-medium leading-6 text-white">Phone Number</label>
          <div class="relative mt-2 rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 flex items-center">
              <label for="phone-extention" class="sr-only">Phone extention</label>
              <select id="phone-extention" name="country" autocomplete="country" class="bg-transparent h-full rounded-md border-0 py-0 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs">
                <option disabled>Select</option>
              </select>
            </div>
            <input type="text" name="phone-number" id="phone-number" class="p-2 block w-full rounded-md border-0 py-1.5 pl-36 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:text-white/20" placeholder="612345678">
          </div>
        </div>
			</div>
		</div>

		<div class="border-b mt-4 border-white/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-white">Address</h2>

      <div class="mt-10 space-y-10">

        <div class="col-span-full">
					<label for="street-address" class="block text-sm font-medium leading-6 text-white">Street address</label>
					<div id="street-addresses" class="mt-2">
            <label class='text-xs font-medium text-white'>${originalLanguage.long}</label>
						
						<div
							contenteditable="true"
							id="street-${originalLanguage.short}"
							name="street-address"
							class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						>
						</div>
						<style>
						[contenteditable="true"].single-line br {
								display:none;
						}
						[contenteditable="true"].single-line * {
								display:inline;
								white-space:nowrap;
						}
						</style>
					<div id="street-other-langs" class="mt-2"></div>
				</div>

				<div class="sm:col-span-2 sm:col-start-1">
					<label for="city" class="block text-sm font-medium leading-6 text-white">City</label>
					<div class="mt-2">
					  <input type="text" name="city" id="city" autocomplete="address-level2" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
					</div>
				</div>

				<div class="sm:col-span-2">
					<label for="region" class="block text-sm font-medium leading-6 text-white">State / Province</label>
					<div class="mt-2">
						<input type="text" name="region" id="region" autocomplete="address-level1" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
					</div>
				</div>

				<div class="sm:col-span-2">
					<label for="postal-code" class="block text-sm font-medium leading-6 text-white">ZIP / Postal code</label>
					<div class="mt-2">
						<input type="text" name="postal-code" id="postal-code" autocomplete="postal-code" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
					</div>
				</div>
      </div>
		</div>
	</div>

	<div class="mt-6 flex items-center justify-end gap-x-6">
		<button type="reset" class="text-sm font-semibold leading-6 text-white">Reset</button>
		<button type="submit" class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Submit</button>
	</div>
</form>
`;

  const languageSelect = document.getElementById("language-select")!;
  languageSelect.innerHTML = generateLanguageOptions(languages);

  populateNationalities();
  populatePhoneExtentions();

  languageSelect?.addEventListener("change", (e) => {
    setOriginalLanguage(languages[(e.target as HTMLSelectElement).value]);
  });

  const about = document.getElementById(`about-${originalLanguage.short}`);
  const parentAbout = document.getElementById("about-other-langs");
  if (about && parentAbout) {
    const renderAboutTranslations = elementTranslationsRenderer(
      about,
      parentAbout,
      false
    );
    about?.addEventListener("blur", () => renderAboutTranslations());
  }

  const street = document.getElementById(`street-${originalLanguage.short}`);
  const parentStreet = document.getElementById("street-other-langs");
  if (street && parentStreet) {
    const renderStreetTranslations = elementTranslationsRenderer(
      street,
      parentStreet,
      true
    );
    street?.addEventListener("blur", () => renderStreetTranslations());
  }

  const form = document.getElementById("form");
  form?.addEventListener("submit", (e) => handleSubmit(e));
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
