import { renderUserInfoForm } from "./form";
import { renderCvsPreviewSlideOver } from "./cvs-preview";
import { GetProfilesOfUser } from "../../../wailsjs/go/main/App";
import { fillForm } from "../../utils/fillForm";
import { renderError } from "./error";
// import { renderFormLanguages } from "../../utils/languages";

let formPage: HTMLDivElement;

export function renderFormPage(userId?: number) {
  formPage = document.querySelector("#form-page")!;
  formPage.innerHTML = `
    <button id="close-page-button" type="button" class="fixed right-4 top-4 rounded-md bg-zinc-700 text-gray-300 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      <span class="sr-only">Close panel</span>
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="px-12 pt-4">
      <div class="px-12 pt-4" id="form-languages-containter"></div>
      <div class="px-12 py-4" id="info-form-container"></div>
      <div id="cvs-preview" class="hidden"></div>
    </div>
	`;

  // renderFormLanguages();

  renderUserInfoForm(userId);

  renderCvsPreviewSlideOver();

  document
    .getElementById("close-page-button")!
    .addEventListener("click", () => {
      hideFormPage();
    });
}

export function showFormPage(userId?: number) {
  renderFormPage(userId);
  formPage.removeAttribute("hidden");
}

export function hideFormPage() {
  formPage.setAttribute("hidden", "true");
}

export async function showUpdateProfileForm(userId: number) {
  let profiles;
  try {
    profiles = await GetProfilesOfUser(userId);
    showFormPage(userId);
    fillForm(profiles);
  } catch (err) {
    console.error(err);
    renderError(err as string);
  }
}
