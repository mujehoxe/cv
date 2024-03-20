import { renderError } from "./error";

let pdfDisplay: Element | null;

export function renderPdfDisplay() {
  pdfDisplay = document.querySelector("#pdf-display");

  if (!pdfDisplay) {
    renderError("Couldn't display pdf");
    return;
  }
  pdfDisplay.innerHTML = `
<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
          <button id="close-pdf-display-btn" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Deactivate account</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed from our servers forever. This action cannot be undone.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
  document
    .getElementById("close-pdf-display-btn")
    ?.addEventListener("click", () => {
      pdfDisplay!.classList.toggle("hidden", true);
    });
}

export function showPdfDisplay() {
  if (!pdfDisplay) {
    renderError("Couldn't display pdf");
    return;
  }
  pdfDisplay.classList.toggle("hidden", false);
}
