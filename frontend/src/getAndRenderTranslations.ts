import { Translate } from "../wailsjs/go/main/App";
import { languages, selectedLanguage, Language } from "./form";

let previousAbout = "";

export function getAndRenderTranslations(e: Event) {
  if (previousAbout == (e.target as HTMLElement).innerText) return;
  previousAbout = (e.target as HTMLElement).innerText;
  const target = e.target as HTMLDivElement;
  if (!target.textContent) return;

  const aboutOtherLangs = document.getElementById("about-other-langs");
  aboutOtherLangs!.innerHTML = ``;
  Object.entries(languages).forEach(([key, language]) => {
    if (!areLanguagesEqual(selectedLanguage, language))
      Translate(
        previousAbout.replace(/\n/g, "<br>"),
        selectedLanguage.short,
        key
      )
        .then((result) => {
          const aboutOtherLang = document.createElement("div");
          const label = document.createElement("label");
          label.classList.add("text-sm", "font-medium", "text-white");
          label.innerText = language.long;
          aboutOtherLang.appendChild(label);
          const aboutBox = document.createElement("div");
          aboutBox.innerText = result;
          aboutBox.classList.add(
            ..."p-2 block w-full h-max min-h-20 rounded-md py-1.5 text-white/40 shadow-sm ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6".split(
              " "
            )
          );
          aboutOtherLang.appendChild(aboutBox);
          const doneEditing = document.createElement("div");
          const editBtn = createEditBtn(aboutOtherLang, doneEditing, aboutBox);
          createDoneEditingBtn(doneEditing, aboutOtherLang, editBtn);
          aboutOtherLang.appendChild(doneEditing);
          aboutOtherLangs!.appendChild(aboutOtherLang);
        })
        .catch((error) => console.error("Error translating text:", error));
  });
}

function createDoneEditingBtn(
  doneEditing: HTMLDivElement,
  editBtn: HTMLDivElement,
  aboutBox: HTMLDivElement
) {
  doneEditing.classList.add("cursor-pointer", "hidden");
  doneEditing.innerHTML = `Done <i class="fa-solid fa-check text-center text-xs"></i>`;
  doneEditing.onclick = () => {
    doneEditing.classList.toggle("hidden");
    editBtn.classList.toggle("hidden");
    aboutBox.contentEditable = "false";
    aboutBox.classList.toggle("text-white/90");
  };
}

function createEditBtn(
  aboutOtherLang: HTMLDivElement,
  doneEditing: HTMLDivElement,
  aboutBox: HTMLDivElement
) {
  const editBtn = document.createElement("div");
  editBtn.classList.add("cursor-pointer");
  editBtn.innerHTML = `Edit <i class="fa-solid fa-pen text-center text-xs"></i>`;
  aboutOtherLang.appendChild(editBtn);
  editBtn.onclick = () => {
    editBtn.classList.toggle("hidden");
    doneEditing.classList.toggle("hidden");
    aboutBox.contentEditable = "true";
    aboutBox.classList.toggle("text-white/90");
  };
  return editBtn;
}

export function areLanguagesEqual(lang1: Language, lang2: Language) {
  return lang1.short === lang2.short;
}
