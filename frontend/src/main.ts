// import { Greet } from "../wailsjs/go/main/App";
import { makeForm } from "./form";

document.querySelector("#app")!.innerHTML = `
  <div>
    <div class="p-12" id="form">
    </div>
  </div>
`;

makeForm();

declare global {
  interface Window {
    greet: () => void;
  }
}
