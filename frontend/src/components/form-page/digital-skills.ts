// digital-skills.ts
import { FetchDigitalSkillsAutocomplete } from "../../../wailsjs/go/main/App";
import { CVProfileData } from "../../utils/formDataExtraction";

export function renderDigitalSkillsForm() {
  const digitalSkillsContainer = document.getElementById("digital-skills");
  if (!digitalSkillsContainer) return;

  digitalSkillsContainer.innerHTML = `
<details>
 	<summary class="text-base font-semibold text-white cursor-pointer">Compétences Numériques</summary>
 	<div class="mx-4">
		<div class="my-4">
			<div class="relative mt-2">
				<input placeholder="" id="combobox" type="text" class="w-full rounded-md border-0 bg-transparent py-1.5 pl-3 pr-12 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" role="combobox" aria-controls="options" aria-expanded="false">
				<button type="button" id="add-digital-skill" class="absolute px-2 inset-y-0 text-center align-middle bg-zinc-600 border-l border-gray-700 rounded-md right-0 flex items-center">
					<i class="fas fa-add text-center align-middle"></i>
				</button>
				<ul 
					id="options" role="listbox"
					class="absolute hidden bg-zinc-800 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md text-white py-1 text-base shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none sm:text-sm" 
				>
				</ul>
			</div>
		</div>

		<div id="selected-skills" class="flex flex-wrap justify-start gap-4"></div>
 	</div>
</details>
 `;

  const combobox = digitalSkillsContainer.querySelector(
    "#combobox"
  ) as HTMLInputElement;
  const options = digitalSkillsContainer.querySelector(
    "#options"
  ) as HTMLUListElement;
  const selectedSkillsDiv = document.getElementById(
    "selected-skills"
  ) as HTMLDivElement;
  const selectedSkills = new Set();

  const addDigitalSkillButton = digitalSkillsContainer.querySelector(
    "#add-digital-skill"
  ) as HTMLButtonElement;
  addDigitalSkillButton.addEventListener("click", (e) => {
    addSkillCard(e);
  });

  combobox.addEventListener("keydown", (e) => {
    if (e.code === "Enter") addSkillCard(e);
  });

  combobox.addEventListener("input", async () => {
    if (combobox.value.length < 3) {
      options.classList.add("hidden");
      return;
    }
    const response = await FetchDigitalSkillsAutocomplete(combobox.value);

    if (response.length == 0) {
      options.classList.add("hidden");
      return;
    }

    options.innerHTML = "";

    document.body.addEventListener("keyup", (e) => {
      if (e.code === "Escape") options.classList.add("hidden");
    });

    response
      .filter((s) => !selectedSkills.has(s))
      .forEach((skill) => {
        const option = document.createElement("li");
        option.classList.add(
          ..."relative p-2 cursor-default select-none focus-visible:bg-indigo-600 hover:bg-indigo-600".split(
            " "
          )
        );
        option.innerHTML = `<span class="block truncate">${skill}</span>`;
        options.appendChild(option);

        option.addEventListener("click", () => {
          renderSkillCard(skill);
          selectedSkills.add(skill);
        });
      });
    options.classList.remove("hidden");
  });

  function addSkillCard(e: Event) {
    e.preventDefault();
    if (!combobox.value && combobox.value === "") return;
    const s = combobox.value;
    if (!selectedSkills.has(s)) {
      renderSkillCard(s);
      selectedSkills.add(s);
    }
  }

  function renderSkillCard(skill: string) {
    const selectedSkill = document.createElement("div");

    selectedSkill.innerHTML = `
		<div class="flex justify-between gap-1 bg-zinc-800 rounded-md p-1 text-sm">
			${skill}
			<button id="delete-digital-skill" type="button" class="text-red-400 float-right ml-1">
				<i class="fa fa-times"></i>
			</button>
		</div>
		`;
    selectedSkillsDiv.appendChild(selectedSkill);

    selectedSkill
      .querySelector("#delete-digital-skill")
      ?.addEventListener("click", () => {
        selectedSkills.delete(skill);
        selectedSkill.remove();
      });

    combobox.value = "";
    options.classList.add("hidden");
  }
}

export function extractDigitalSkillsData(data: CVProfileData) {
  const selectedSkills = document.getElementById("selected-skills");

  if (!selectedSkills) return;

  const digitalSkills = Array.from(selectedSkills.children).map((skill) => {
    return (skill as HTMLElement).innerText;
  });

  if (digitalSkills.length > 0) {
    data.profile.preference.profileStructure.push("digital-skills");
    data.profile.digitalSkills = {
      other: digitalSkills,
    };
  }
}
