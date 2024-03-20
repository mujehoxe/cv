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
  </div>
`;

renderForm();
renderCvsPreviewSlideOver();
declare global {
  interface Window {
    greet: () => void;
  }
}
