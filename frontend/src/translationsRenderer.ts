import { Translate } from "../wailsjs/go/main/App";
import { Language, languages, originalLanguage } from "./languages";

interface Translation {
  language: Language;
  content: string;
}

export function elementTranslationsRenderer(
  element: HTMLElement,
  parent: HTMLElement
): () => void {
  let previousInput = "";

  async function getTranslations(): Promise<Translation[]> {
    const currentInput = element.innerText;
    if (previousInput == currentInput) return [];
    previousInput = currentInput;

    if (!element.textContent || element.textContent.trim() == "") {
      parent.innerHTML = "";
      return [];
    }

    parent.innerHTML = `<div class="loading-indicator">Loading translations...</div>`;

    const translations: Translation[] = [];

    for (const [_, otherLanguage] of Object.entries(languages)) {
      if (areLanguagesEqual(originalLanguage, otherLanguage)) continue;
      try {
        const translation: Translation = {
          language: otherLanguage,
          content: await Translate(
            element.textContent!.replace(/\n/g, "<br>"),
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

  return async function renderTranslations() {
    const translations = await getTranslations();

    for (const translation of translations) {
      const inputDiv = document.createElement("div");
      inputDiv.outerHTML = `<label class="text-xs font-medium text-white">${translation.language.long}</label>`;
      inputDiv.classList.add(
        ..."p-2 block w-full h-max min-h-20 rounded-md py-1.5 text-white/40 shadow-sm ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6".split(
          " "
        )
      );
      inputDiv.innerHTML = translation.content;
      parent.appendChild(inputDiv);

      const editBtn = createEditButton(parent);
      const doneEditing = createDoneEditingButton(parent);

      editBtn.onclick = () => {
        handleToggleEditing(editBtn, doneEditing, inputDiv);
      };

      doneEditing.onclick = () => {
        handleToggleEditing(editBtn, doneEditing, inputDiv);
      };
    }
  };
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
