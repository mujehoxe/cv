import { renderDashboard } from "./components/dashboard-page/dashboard";
import { renderFormPage } from "./components/form-page/form-page";
import "./index.css";

document.querySelector("#app")!.innerHTML = `
  <div id="root" class='relative h-screen'>
    <div class="px-12 pt-4" id="dashboard"></div>
    <div class="absolute left-0 top-0 right-0 z-10 bg-zinc-900" id="form-page" hidden></div>
    <div
      id="notification"
      aria-live="assertive"
      class="pointer-events-none fixed left-0 inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    ></div>
  </div>
`;

renderDashboard();
renderFormPage();
