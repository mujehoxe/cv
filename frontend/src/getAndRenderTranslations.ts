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
          const editBtn = createEditButton();
          editBtn.onclick = () =>
            handleToggleEditing(editBtn, doneEditing, aboutBox);
          const doneEditing = createDoneEditingButton();
          doneEditing.onclick = () =>
            handleToggleEditing(editBtn, doneEditing, aboutBox);
          aboutOtherLang.appendChild(doneEditing);
          aboutOtherLang.appendChild(editBtn);
          aboutOtherLangs!.appendChild(aboutOtherLang);
        })
        .catch((error) => console.error("Error translating text:", error));
  });
}

function createEditButton() {
  const edit = document.createElement("div");
  edit.classList.add(
    ..."cursor-pointer inline p-1 text-xs rounded-md ring-1 rounded-5 ring-inset ring-white/20".split(
      " "
    )
  );
  edit.innerHTML = `Edit <i class="pl-1 mb-2 fa-solid fa-pen text-center text-xs"></i>`;
  return edit;
}
function createDoneEditingButton() {
  const doneEditing = document.createElement("div");
  doneEditing.classList.add(
    ..."cursor-pointer inline p-1 text-xs rounded-md ring-1 rounded-5 ring-inset ring-white/20 hidden".split(
      " "
    )
  );
  doneEditing.innerHTML = `Done <i class="pl-1 mb-2 fa-solid fa-check text-center text-xs"></i>`;
  return doneEditing;
}

function handleToggleEditing(
  editBtn: HTMLDivElement,
  doneEditing: HTMLDivElement,
  aboutBox: HTMLDivElement
) {
  editBtn.classList.toggle("hidden");
  doneEditing.classList.toggle("hidden");
  aboutBox.contentEditable = String(!aboutBox.isContentEditable);
  aboutBox.classList.toggle("text-white/90");
}

export function areLanguagesEqual(lang1: Language, lang2: Language) {
  return lang1.short === lang2.short;
}
