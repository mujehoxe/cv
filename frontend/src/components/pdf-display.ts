import { renderError } from "./error";

let pdfDisplay: Element | null;
let pdfDisplayFrame: HTMLIFrameElement;

export function setPdfSrc(src: string) {
  pdfDisplayFrame.src = src;
}

export function renderPdfDisplay() {
  pdfDisplay = document.querySelector("#pdf-display") as HTMLDivElement;

  if (!pdfDisplay) {
    renderError("Couldn't display pdf");
    return;
  }

  //pdfDisplay prevent scrolling
  pdfDisplay.innerHTML = `
<div class="relative overflow-hidden h-svh z-10 w-full" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  <div class="fixed w-full inset-0 z-10 overflow-y-auto">
    <div class="flex items-end justify-center text-center sm:items-center">
      <div class="relative w-full m-10 transform overflow-hidden rounded-lg bg-zinc-800 text-left shadow-xl transition-all">
        <div class="absolute right-0 top-0 pr-4 pt-4 sm:block">
          <button id="close-pdf-display-btn" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="sr-only">Close</span>
            <i class="fas fa-times text-white"></i>
          </button>
        </div>
        <div class="sm:flex sm:items-start mt-10 p-4 overflow-hidden">
          <iframe id="pdf-display-frame" width="100%" height="600px" type="application/pdf">
        </div>
      </div>
    </div>
  </div>
</div>
`;

  pdfDisplay
    .querySelector("#close-pdf-display-btn")
    ?.addEventListener("click", () => {
      pdfDisplay!.classList.toggle("hidden", true);
    });

  pdfDisplayFrame = pdfDisplay.querySelector(
    "#pdf-display-frame"
  ) as HTMLIFrameElement;
}
