export function renderLoadingIndicator(parent: HTMLElement, msg?: string) {
  parent.innerHTML = `
	<div id='loading' class="flex justify-start items-center min-h-12 p-2 rounded-md">
    <div class="animate-spin rounded-[50%] border-t-[#3498db] border-white border-[2px] border-solid w-4 h-4"></div>
    <p class="text-white ml-2 text-sm font-medium">
      Loading ${msg ? msg : ""}...
    </p>
  </div>
	`;
}

export function removeLoadingIndicator(parent: HTMLElement) {
  const loadingIndicator = parent.querySelector("#loading");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

export function renderFloatingLoadingIndicator(msg: string) {
  const cvsPreview = document.querySelector("#notification") as HTMLDivElement;
  cvsPreview!.innerHTML = `
  <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
  <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-zinc-700 shadow-lg ring-1 ring-white ring-opacity-5">
    <div class="p-4">
      <div class="flex items-start">
        <div id='loading' class="ml-3 w-0 flex-1 pt-0.5"></div>
        <div class="ml-4 flex flex-shrink-0">
          <button id="close-button" type="button" class="inline-flex rounded-md bg-zinc-500 text-gray-200 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="sr-only">Close</span>
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
`;

  const parent = cvsPreview.querySelector("#loading") as HTMLElement;
  renderLoadingIndicator(parent, msg);

  const closeButton = cvsPreview.querySelector(
    "#close-button"
  ) as HTMLButtonElement;
  closeButton.addEventListener("click", () => {
    closeFloatingLoadingIndicator();
  });
}

export function closeFloatingLoadingIndicator() {
  const cvsPreview = document.querySelector("#notification") as HTMLDivElement;
  cvsPreview.innerHTML = "";
}
