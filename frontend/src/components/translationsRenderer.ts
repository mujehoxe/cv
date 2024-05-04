import Quill from "quill";
import { Translate } from "../../wailsjs/go/main/App";
import { Language, formLanguages, originalLanguage } from "./languages";
import {
  removeLoadingIndicator,
  renderLoadingIndicator,
} from "./loadingIndicator";

interface Translation {
  language: Language;
  content: string;
}

function getElement(nameOrElement: string | HTMLDivElement): HTMLDivElement {
  if (typeof nameOrElement === "string") {
    return document.getElementById(
      nameOrElement + "-" + originalLanguage.short
    ) as HTMLDivElement;
  }
  return nameOrElement;
}

function getParentElement(element: HTMLDivElement): HTMLDivElement {
  return element.nextElementSibling as HTMLDivElement;
}

export function elementTranslationsRendererFor(
  name: string,
  isSingleLine: boolean
): void;
export function elementTranslationsRendererFor(
  element: HTMLDivElement,
  isSingleLine: boolean
): void;

export function elementTranslationsRendererFor(
  nameOrElement: string | HTMLDivElement,
  isSingleLine: boolean
): void {
  const element = getElement(nameOrElement);
  const parent = getParentElement(element);

  var previousInput = "";
  element.addEventListener("blur", () => {
    const currentInput = element.innerText.replace(/^\n+|\n+$/g, "");
    if (previousInput === currentInput) return;
    previousInput = currentInput;

    if (!currentInput || currentInput.trim() === "") {
      parent.innerHTML = "";
      return;
    }
    renderTranslations(currentInput, parent, isSingleLine);
  });
}

async function renderTranslations(
  input: string,
  parent: HTMLDivElement,
  isSingleLine: boolean
): Promise<void> {
  renderLoadingIndicator(parent);
  for (const [_, otherLanguage] of Object.entries(formLanguages)) {
    if (areLanguagesEqual(originalLanguage, otherLanguage)) continue;
    try {
      const translation: Translation = {
        language: otherLanguage,
        content: await Translate(
          input.replace(/\r?\n/g, "<br>"),
          originalLanguage.short,
          otherLanguage.short
        ),
      };
      renderInputDivForTranslation(translation, parent, isSingleLine);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  }

  removeLoadingIndicator(parent);
}

function renderInputDivForTranslation(
  translation: Translation,
  parent: HTMLDivElement,
  isSingleLine: boolean
): void {
  const inputDiv = document.createElement("div");
  const name = parent.id.replace("-other-langs", "");
  inputDiv.id = name + "-" + translation.language.short;
  parent.insertAdjacentHTML(
    "beforeend",
    `<label class="block text-xs font-medium text-white">${translation.language.long}</label>`
  );
  inputDiv.classList.add(
    ...`p-2 overflow-hidden block w-full h-max rounded-md py-1.5 text-white/40 shadow-sm ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6`.split(
      " "
    )
  );
  isSingleLine && inputDiv.classList.add("single-line", "whitespace-nowrap");
  inputDiv.innerHTML = translation.content;
  parent.appendChild(inputDiv);

  const editBtn = createEditButton(parent);
  const doneEditing = createDoneEditingButton(parent);

  editBtn.onclick = () => handleToggleEditing(editBtn, doneEditing, inputDiv);
  doneEditing.onclick = () =>
    handleToggleEditing(editBtn, doneEditing, inputDiv);
}

export function translationsRendererForQuill(name: string, quill: Quill) {
  if (!quill.root.parentElement) return;
  const parent = getParentElement(quill.root.parentElement as HTMLDivElement);

  quill.on("selection-change", (range) => {
    if (!range) {
      renderTranslations();
    }
  });

  let previousInput = "";
  async function renderTranslations() {
    const currentInput = quill?.root.innerHTML.replace(/^\n+|\n+$/g, "");
    if (previousInput == currentInput) return;
    previousInput = currentInput;

    if (!currentInput || currentInput.trim() == "") {
      parent.innerHTML = "";
      return;
    }

    renderLoadingIndicator(parent);

    for (const [_, otherLanguage] of Object.entries(formLanguages)) {
      if (areLanguagesEqual(originalLanguage, otherLanguage)) continue;
      try {
        const translation: Translation = {
          language: otherLanguage,
          content: await Translate(
            currentInput,
            originalLanguage.short,
            otherLanguage.short
          ),
        };
        renderInputQuillForTranslation(translation);
      } catch (error) {
        console.error("Error translating text:", error);
      }
    }

    removeLoadingIndicator(parent);
  }

  function renderInputQuillForTranslation(translation: Translation) {
    const inputDiv = document.createElement("div");
    inputDiv.id = name + "-" + translation.language.short;
    parent.insertAdjacentHTML(
      "beforeend",
      `<label class="block text-xs font-medium text-white">${translation.language.long}</label>`
    );
    const inputQuill = new Quill(inputDiv, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        clipboard: {
          matchVisual: false,
        },
      },
    });

    inputQuill.root.innerHTML = translation.content;
    inputDiv.classList.add("mb-2");
    parent.appendChild(inputDiv);
  }
}

function createButton(
  parent: HTMLElement,
  text: string,
  icon: string,
  classes: string[]
) {
  const button = document.createElement("div");
  parent.appendChild(button);
  button.classList.add(...classes);
  button.innerHTML = `${text} <i class="pl-1 mb-2 fa-solid ${icon} text-center text-xs"></i>`;
  return button;
}

function createEditButton(parent: HTMLElement) {
  return createButton(
    parent,
    "Edit",
    "fa-pen",
    "cursor-pointer inline p-1 text-xs rounded-md ring-1 rounded-5 ring-inset ring-white/20".split(
      " "
    )
  );
}

function createDoneEditingButton(parent: HTMLElement) {
  return createButton(
    parent,
    "Done",
    "fa-check",
    "cursor-pointer inline p-1 text-xs rounded-md ring-1 rounded-5 ring-inset ring-white/20 hidden".split(
      " "
    )
  );
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
