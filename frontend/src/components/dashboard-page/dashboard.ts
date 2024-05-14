import { showFormPage } from "../form-page/form-page";

export function renderDashboard() {
  //apply tailwind css classes
  document.querySelector("#dashboard")!.innerHTML = `
	<div class="flex flex-col h-screen">
		<h1 class="text-xl font-bold text-gray-200">Dashboard</h1>
		<button id='create-cv-btn' class="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded mt-10">Create CV</button>
		<ul id="cvs" class="mt-4"></ul>
	</div>
	`;

  document.getElementById("create-cv-btn")?.addEventListener("click", () => {
    showFormPage();
  });
}
