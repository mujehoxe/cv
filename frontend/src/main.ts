// import { Greet } from "../wailsjs/go/main/App";
import { renderForm } from "./form";

document.querySelector("#app")!.innerHTML = `
  <div>
    <div class="p-12" id="form">
    </div>
    <div id="cvs-preview">
    </div>
  </div>
`;

renderForm();

declare global {
  interface Window {
    greet: () => void;
  }
}
