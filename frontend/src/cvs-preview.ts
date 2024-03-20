export function renderCvsPreviewSlideOver() {
  const cvsPreview = document.querySelector("#cvs-preview")!;
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
              <div id="pdfs-container" class="flex flex-auto flex-wrap justify-between">
              </div>
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
      cvsPreview!.innerHTML = "";
    });
}

import { PDFDocumentProxy } from "pdfjs-dist";

// @ts-ignore
const pdfjsLib = window["pdfjs-dist/build/pdf"];

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js";

export function renderPreviewPdf(pdfContent: number[], language: string) {
  const pdfFrame = renderPdfFrame(language);

  // @ts-ignore
  var pdfData = atob(pdfContent as string);
  var pdfArray = new Uint8Array(pdfData.length);
  for (var i = 0; i < pdfData.length; i++) {
    pdfArray[i] = pdfData.charCodeAt(i);
  }

  pdfjsLib.getDocument({ data: pdfArray }).promise.then(
    function (pdf: PDFDocumentProxy) {
      pdf.getPage(1).then(function (page) {
        var scale = 0.7;
        var viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement("canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.classList.add(
          "w-72",
          "p-1",
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

function renderPdfFrame(language: string) {
  const pdfContainer = document.getElementById("pdfs-container");
  const pdfFrame = document.createElement("div");
  pdfContainer?.appendChild(pdfFrame);

  pdfFrame.id = `pdf-${language}`;
  pdfFrame.classList.add("relative", "p-2");
  pdfFrame.innerHTML = `
  <h1 class='font-bold text-xl uppercase p-1'>
    ${language}
  </h1>
  
  <div>
    <div class="w-72 flex border-t border-x rounded-t-lg border-white/10 divide-x divide-white/10">
      <div class="flex w-0 flex-1">
        <button onclick="window.print()" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-300">
          <i class="text-center text-lg m-0 p-0 fas fa-solid fa-print"></i>
          Print
        </button>
      </div>
      <div class="-ml-px flex w-0 flex-1">
        <button class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm text-gray-300 font-semibold">
          <i class="text-center text-lg m-0 p-0 fa-solid fa-eye"></i>
          Preview
        </button>
      </div>
    </div>
  </div>
  `;

  return pdfFrame;
}
