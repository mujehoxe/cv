export function renderError(err: string) {
  const notifaction = document.querySelector("#notification")!;
  notifaction!.innerHTML = `
<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
  <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-zinc-700 shadow-lg ring-1 ring-white ring-opacity-5">
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <i
            class="text-yellow-500 text-center text-sm h-4 w-4 fas fa-solid fa-warning">
          </i>
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-gray-200">Encountered and error, please try again</p>
          <p class="mt-1 text-sm text-gray-400 capitalize">${err}</p>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <button id="close-error-button" type="button" class="inline-flex rounded-md bg-zinc-500 text-gray-200 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
`;
  document
    .getElementById("close-error-button")
    ?.addEventListener("click", () => {
      notifaction!.innerHTML = "";
    });
}
