import { Translate } from "../wailsjs/go/main/App";
import { Language, languages, originalLanguage } from "./languages";
import { renderLoadingIndicator } from "./loadingIndicator";

interface Translation {
  language: Language;
  content: string;
}

export function elementTranslationsRendererFor(
  name: string,
  isSigleLine: boolean
) {
  const element = document.getElementById(
    name + "-" + originalLanguage.short
  ) as HTMLDivElement;
  const parent = document.getElementById(
    `${name}-other-langs`
  ) as HTMLDivElement;

  element.addEventListener("blur", () => renderTranslations());

  let previousInput = "";
  async function getTranslations(): Promise<Translation[]> {
    const currentInput = element?.innerText.replace(/^\n+|\n+$/g, "");
    if (previousInput == currentInput) return [];
    previousInput = currentInput;

    if (!currentInput || currentInput.trim() == "") {
      parent.innerHTML = "";
      return [];
    }

    renderLoadingIndicator(parent);

    const translations: Translation[] = [];

    for (const [_, otherLanguage] of Object.entries(languages)) {
      if (areLanguagesEqual(originalLanguage, otherLanguage)) continue;
      try {
        const translation: Translation = {
          language: otherLanguage,
          content: await Translate(
            currentInput!.replace(/\r?\n/g, "<br>"),
            originalLanguage.short,
            otherLanguage.short
          ),
        };
        translations.push(translation);
      } catch (error) {
        console.error("Error translating text:", error);
      }
    }

    parent.innerHTML = "";

    return translations;
  }

  function renderInputDivForTranslation(translation: Translation) {
    const inputDiv = document.createElement("div");
    inputDiv.id = name + "-" + translation.language.short;
    parent.insertAdjacentHTML(
      "beforeend",
      `<label class="block text-xs font-medium text-white">${translation.language.long}</label>`
    );
    inputDiv.classList.add(
      ...`p-2 whitespace-nowrap overflow-hidden block w-full h-max rounded-md py-1.5 text-white/40 shadow-sm ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6`.split(
        " "
      )
    );
    isSigleLine && inputDiv.classList.add("single-line");
    inputDiv.innerText = translation.content;
    parent.appendChild(inputDiv);

    const editBtn = createEditButton(parent);
    const doneEditing = createDoneEditingButton(parent);

    editBtn.onclick = () => handleToggleEditing(editBtn, doneEditing, inputDiv);

    doneEditing.onclick = () =>
      handleToggleEditing(editBtn, doneEditing, inputDiv);
  }

  async function renderTranslations() {
    const translations = await getTranslations();

    for (const translation of translations) {
      renderInputDivForTranslation(translation);
    }
  }
}

function createEditButton(parent: HTMLElement) {
  const edit = document.createElement("div");
  parent.appendChild(edit);
  edit.classList.add(
    ..."cursor-pointer inline p-1 text-xs rounded-md ring-1 rounded-5 ring-inset ring-white/20".split(
      " "
    )
  );
  edit.innerHTML = `Edit <i class="pl-1 mb-2 fa-solid fa-pen text-center text-xs"></i>`;

  return edit;
}
function createDoneEditingButton(parent: HTMLElement) {
  const doneEditing = document.createElement("div");
  parent.appendChild(doneEditing);
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
  inputDiv: HTMLElement
) {
  editBtn.classList.toggle("hidden");
  doneEditing.classList.toggle("hidden");
  inputDiv.contentEditable = String(!inputDiv.isContentEditable);
  inputDiv.classList.toggle("text-white/80");
  inputDiv.focus();
}

export function areLanguagesEqual(lang1: Language, lang2: Language) {
  return lang1.short === lang2.short;
}
