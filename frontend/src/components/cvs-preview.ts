import { PDFDocumentProxy } from "pdfjs-dist";
import { setPdfSrc } from "./pdf-display";

// @ts-ignore
const pdfjsLib = window["pdfjs-dist/build/pdf"];

let cvsPreview = document.querySelector("#cvs-preview");

export function renderCvsPreviewSlideOver() {
  cvsPreview = document.querySelector("#cvs-preview");
  cvsPreview!.innerHTML = `
<div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-900 opacity-80"></div>

  <div class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="pointer-events-none fixed inset-y-0 right-0 flex w pl-10 sm:pl-16 w-full">
        <div class="pointer-events-auto w-full">
          <div class="flex h-full flex-col overflow-y-scroll bg-zinc-900 py-6 shadow-xl">
            <div class="px-4 sm:px-6">
              <div class="flex items-start justify-between">
                <h2 class="text-base font-semibold leading-6 text-gray-100" id="slide-over-title">Panel title</h2>
                <div class="ml-3 flex h-7 items-center">
                  <button id="close-slide-over-button" type="button" class="rounded-md bg-zinc-700 text-gray-300 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span class="sr-only">Close panel</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="relative mt-6 flex-1 px-4 sm:px-6">
              <div id="pdfs-container" class="flex flex-auto flex-wrap justify-between overflow-hidden">
              </div>
              <style>
                /* Hide the controls */
                iframe::-webkit-media-controls {
                    display: none!important;
                }
                /* For Firefox */
                @-moz-document url-prefix() {
                    iframe video::-moz-media-controls {
                        display: none!important;
                    }
                }
              </style>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
  document
    .getElementById("close-slide-over-button")
    ?.addEventListener("click", () => {
      cvsPreview!.classList.toggle("hidden", true);
      const rootElement = document.querySelector("#root");
      if (rootElement) {
        rootElement.classList.remove("overflow-hidden");
      }
    });
}

export function showCvsPreviewSlideOver() {
  cvsPreview!.classList.toggle("hidden", false);
  const rootElement = document.querySelector("#root");
  if (rootElement) {
    rootElement.classList.add("overflow-hidden");
  }
}

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js";

export function renderPreviewPdf(pdfPath: string, language: string) {
  const pdfFrame = renderPdfFrame(language, pdfPath);

  pdfjsLib.getDocument(pdfPath).promise.then(
    function (pdf: PDFDocumentProxy) {
      pdf.getPage(1).then(function (page) {
        var scale = 1;
        var viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement("canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.classList.add(
          "w-[36rem]",
          "p-2",
          "border",
          "rounded-b-lg",
          "border-white/10"
        );

        pdfFrame?.appendChild(canvas);

        const context = canvas.getContext("2d");
        if (!context) return;
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        page.render(renderContext);
      });
    },
    function (reason: any) {
      console.error(reason);
    }
  );
}

function renderPdfFrame(language: string, pdfSrc: string) {
  let pdfContainer = document.getElementById(`pdf-${language}`);
  if (pdfContainer === null) {
    pdfContainer = document.createElement("div");
    pdfContainer.id = `pdf-${language}`;
    pdfContainer.classList.add("relative", "p-2", "overflow-hidden");
    document.getElementById("pdfs-container")?.appendChild(pdfContainer);
  }

  pdfContainer.innerHTML = `
  <h1 class='static font-bold text-xl uppercase p-1'>
    ${language}
  </h1>
  <div id="display-btn" class="absolute top-9 rounded-md inset-0 bg-zinc-900 bg-opacity-85 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
    Display In Default Viewer
    <i class="fas fa-eye ml-2"></i>
  </div>
  `;

  pdfContainer
    .querySelector("#display-btn")
    ?.addEventListener("click", async () => {
      document.body.style.cursor = "wait";
      await OpenPDF(pdfSrc);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      document.body.style.cursor = "";
    });

  return pdfContainer;
}
