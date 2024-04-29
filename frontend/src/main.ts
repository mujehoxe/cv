import "./index.css";

import { renderUserInfoForm } from "./form";
import { renderCvsPreviewSlideOver } from "./cvs-preview";
import { renderPdfDisplay } from "./pdf-display";
import { renderLanguages } from "./languages";

document.querySelector("#app")!.innerHTML = `
  <div>
    <div class="px-12 pt-4" id="languages-containter"></div>
    <div class="px-12 pt-4" id="info-form-container">
    </div>
    <div id="cvs-preview" class="hidden">
    </div>
    <div id="pdf-display" class="hidden">
    </div>
    <div
      id="notification"
      aria-live="assertive"
      class="pointer-events-none fixed left-0 inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    ></div>
  </div>
`;

renderLanguages();

renderUserInfoForm();

renderCvsPreviewSlideOver();

renderPdfDisplay();
declare global {
  interface Window {
    greet: () => void;
  }
}
