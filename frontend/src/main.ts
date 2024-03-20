// import { Greet } from "../wailsjs/go/main/App";
import { renderForm } from "./form";
import { renderCvsPreviewSlideOver } from "./cvs-preview";

document.querySelector("#app")!.innerHTML = `
  <div>
    <div class="p-12" id="form">
    </div>
    <div id="cvs-preview" class="hidden">
    </div>
    <div id="pdf-display">
    </div>
    <div
      id="notification"
      aria-live="assertive"
      class="pointer-events-none fixed left-0 inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    ></div>
  </div>
`;

renderForm();

renderCvsPreviewSlideOver();
declare global {
  interface Window {
    greet: () => void;
  }
}
