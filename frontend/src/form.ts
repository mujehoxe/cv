import { FetchCV } from "../wailsjs/go/main/App";
import { populateNationalities, populatePhoneExtentions } from "./countries";
import { renderPreviewPdf, showCvsPreviewSlideOver } from "./cvs-preview";
import { renderError } from "./error";
import { getAndRenderTranslations } from "./getAndRenderTranslations";

export type Language = {
  short: string;
  long: string;
};

type Languages = {
  [key: string]: Language;
};

export const languages: Languages = {
  EN: { short: "EN", long: "English" },
  FR: { short: "FR", long: "French" },
  DE: { short: "DE", long: "German" },
  ES: { short: "ES", long: "Spanish" },
};

export let selectedLanguage: Language = { short: "EN", long: "English" };

function handleSubmit(e: Event) {
  e.preventDefault();

  const cvs = new Map();
  showCvsPreviewSlideOver();
  for (const language in languages) {
    data.profile.language = language;
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

const data = {
  id: null,
  profile: {
    language: "en",
    personalInformation: {
      firstName: "abc",
      lastName: "def",
      personalMottoLine: null,
      personalDescription: "Hello this is a test.",
      sex: "male",
      nationalities: [],
      socialMediaWebsites: [],
      emails: [],
      phones: [],
      addresses: [],
      websites: [],
      instantMessengers: [],
    },
    preference: {
      id: "",
      profileId: "",
      profileStructure: [],
      dateFormat: "dd/MM/yyyy",
    },
    customSections: [],
  },
  template: {
    displayLogo: "first",
    displayPageNumber: false,
    color: "none",
    fontSize: "medium",
    templateName: "cv-formal",
  },
};

export function renderForm() {
  document.querySelector("#form")!.innerHTML = `
<form id="form">
	<div class="space-y-12">
		<div class="mt-6 flex items-center justify-end gap-x-6">
			<button type="button" class="text-sm font-semibold leading-6 text-white">Cancel</button>
			<button type="submit" class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Submit</button>
		</div>

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
			<label for="photo" class="text-sm font-medium leading-6 text-white">Language</label>
			<select id="language-select" name="gender" autocomplete="gender" class="p-2 w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
				<option>Select from list</option>
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
						<input type="text" placeholder="e.g. John" name="first-name" id="first-name" autocomplete="given-name" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="last-name" class="block text-sm font-medium leading-6 text-white">
						Last name
						<span class="text-red-500">*</span>
					</label>
					<div class="mt-2">
						<input type="text" placeholder="e.g. Doe" name="last-name" id="last-name" autocomplete="family-name" class="p-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
					</div>
				</div>

				<div class="col-span-full">
					<label for="about" class="block text-sm font-medium leading-6 text-white">
						About me
						<i
							title="Highlight who you are. Describe your professional and/or personal self. Example 1: I am a professional photographer with five years of experience in photography, portraits and family pictures. I am looking for new exciting projects. Example 2: I am a student majoring in computer science looking for internships to get work experience."
							class="text-blue-500 text-center text-xs fas fa-solid fa-circle-info">
						</i>
					</label>
					<p class="mt-3 text-sm leading-6 text-gray-400">Write a few sentences about yourself.</p>
					<div id='about' class="mt-2">
						<div
							id="about-original-lang"
							rows="3"
							contenteditable="true"
							placeholder="You can provide a description of yourself here..."
							class="p-2 block w-full h-max min-h-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
						</div>
						<div id="about-other-langs"></div>
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
							<option>Select from list</option>
							<option>Male</option>
							<option>Female</option>
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
            <input type="text" name="phone-number" id="phone-number" class="p-2 block w-full rounded-md border-0 py-1.5 pl-36 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="612345678">
          </div>
        </div>
			</div>
		</div>

		<div class="border-b mt-4 border-white/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-white">Contact</h2>
		</div>
	</div>

	<div class="mt-6 flex items-center justify-end gap-x-6">
		<button type="button" class="text-sm font-semibold leading-6 text-white">Cancel</button>
		<button type="submit" class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Submit</button>
	</div>
</form>
`;
  const form = document.getElementById("form");
  form?.addEventListener("submit", (e) => handleSubmit(e));

  document
    .getElementById("about-original-lang")
    ?.addEventListener("blur", getAndRenderTranslations);

  const languageSelect = document.getElementById("language-select")!;
  languageSelect.innerHTML = generateLanguageOptions(languages);

  populateNationalities();
  populatePhoneExtentions();

  languageSelect?.addEventListener("change", (e) => {
    selectedLanguage = languages[(e.target as HTMLSelectElement).value];
    console.log(selectedLanguage);
  });
}

function generateLanguageOptions(languages: Languages) {
  // prettier-ignore
  return Object.entries(languages).map(
      ([key, language]) => `<option value="${key}">${language.long}</option>`
  ).join("");
}

interface Country {
  name: { common: string };
}

async function populateCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const countries: Country[] = await response.json();

    const countrySelect = document.getElementById("country");

    countries
      .sort((a, b) => (a.name.common > b.name.common ? 1 : -1))
      .forEach((country: Country) => {
        const option = document.createElement("option");
        option.value = country.name.common;
        option.textContent = country.name.common;
        countrySelect?.appendChild(option);
      });
  } catch (error) {
    console.error("Failed to fetch countries:", error);
  }
}

populateCountries();
