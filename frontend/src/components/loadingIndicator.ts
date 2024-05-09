export function renderLoadingIndicator(parent: HTMLElement) {
  parent.innerHTML = `
	<div id='loading' class="flex justify-start items-center min-h-12 p-2 rounded-md">
      <div class="animate-spin rounded-[50%] border-t-[#3498db] border-white border-[2px] border-solid w-4 h-4"></div>
      <p class="text-white ml-2 text-sm font-medium">Loading...</p>
  </div>
	`;
}

export function removeLoadingIndicator(parent: HTMLElement) {
  const loadingIndicator = parent.querySelector("#loading");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}
