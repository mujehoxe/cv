import "./index.css";

import { renderUserInfoForm } from "./components/form";
import { renderCvsPreviewSlideOver } from "./components/cvs-preview";
import { renderPdfDisplay } from "./components/pdf-display";
import { renderFormLanguages } from "./components/languages";

document.querySelector("#app")!.innerHTML = `
  <div id="root" class='h-screen'>
    <div class="px-12 pt-4" id="form-languages-containter"></div>
    <div class="px-12 py-4" id="info-form-container">
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

renderFormLanguages();

renderUserInfoForm();

renderCvsPreviewSlideOver();

renderPdfDisplay();
