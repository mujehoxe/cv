import { extractDateFrom, fillDate } from "../../utils/dateExtraction";
import {
  CVProfileData,
  CustomSection,
  CustomSectionsRecord,
} from "../../utils/formDataExtraction";
import { originalLanguage } from "../../utils/languages";
import {
  elementTranslationsRendererFor,
  renderEmptyInputDivsForAllLanguages,
} from "./translationsRenderer";

export function renderOtherSectionForm(title?: string) {
  const otherSectionsDiv = document.getElementById(
    "other-sections"
  ) as HTMLDivElement;

  const sectionDiv = document.createElement("div");
  sectionDiv.innerHTML = `
  <div id='other-sections-form'>
     <details class="border-b border-white/10">
      <summary class="text-base py-2 font-semibold text-white cursor-pointer flex justify-between items-center"
				><span id="section-label" class="font-semibold">${
          title ? title : "Section"
        }</span>
				<button
					type="button"
					id="delete"
					class="text-sm font-medium text-red-300 bg-transparent border border-white/10 p-2 rounded-md hover:bg-white/10 hover:text-red-700 transition-colors duration-200"
				>
					<i class="fa-solid fa-trash"></i>
				</button>
			</summary>
			<label
				class="block text-sm font-medium leading-6 text-white">Nom de Section</label>
			<div class="mx-2">
				<label for="section-name-${
          originalLanguage.short
        }" class="text-xs font-medium text-white"
				>${originalLanguage.long}</label>
				<div
					contenteditable="true"
					id="section-name-${originalLanguage.short}"
					class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full h-9 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
				></div>
				<div id="section-name-other-langs" class="mt-2"></div>
			</div>

			<div id="records" class="px-4 pt-4"></div>
			<button type="button" id="add-record" 
				class="rounded-md bg-indigo-500 p-2 m-2 mx-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200">
			+ Ajouter une ${title ? title : "Enregistrement"}</button>
     </details>
  </div>
  `;
  otherSectionsDiv.appendChild(sectionDiv);

  const sectionName = sectionDiv.querySelector(
    `#section-name-${originalLanguage.short}`
  ) as HTMLDivElement;

  sectionName.addEventListener("input", updateSectionName);

  const addRecord = sectionDiv.querySelector("#add-record")!;
  addRecord.addEventListener("click", (e) => {
    e.preventDefault();
    renderRecord(sectionDiv);
  });

  elementTranslationsRendererFor(sectionName, true);

  function updateSectionName() {
    let name = "Section";
    if (sectionName && sectionName.innerText != "") {
      name = sectionName.innerText;
    }

    const label = sectionDiv.querySelector(`#section-label`) as HTMLSpanElement;
    label.innerHTML = name;
    addRecord.textContent = "+ Ajouter une " + name;
  }

  const deleteButton = sectionDiv.querySelector("#delete") as HTMLButtonElement;
  deleteButton.addEventListener("click", () =>
    otherSectionsDiv.removeChild(sectionDiv)
  );

  return sectionDiv;
}

function renderRecord(parent: Element) {
  const recordsDiv = parent.querySelector("#records")!;
  const recordDiv = document.createElement("div");
  recordDiv.innerHTML = `
	<details id="other-record" class="border-b pt-2 border-white/10">
		<summary class="text-base font-semibold leading-6 text-white cursor-pointer flex justify-between">
			<span>
				<span id="record-label" class="font-normal">Enregistrement</span>
			</span>
			<button
				type="button"
				id="delete"
				class="text-sm font-medium text-red-300 bg-transparent border border-white/10 p-2 rounded-md hover:bg-white/10 hover:text-red-700 transition-colors duration-200"
			>
				<i class="fa-solid fa-trash"></i>
			</button>
		</summary>
		<div>
			<label
				class="block text-sm font-medium leading-6 text-white">Nom d'Enregistrement</label>
			<div class="mx-2">
				<label for="record-name-${originalLanguage.short}" class="text-xs font-medium text-white"
					>${originalLanguage.long}</label>
				<div
					contenteditable="true"
					id="record-name-${originalLanguage.short}"
					class="single-line whitespace-nowrap overflow-hidden overflow-x-auto p-2 block w-full h-9 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
				></div>
				<div id="record-name-other-langs" class="mt-2"></div>
			</div>

			<div class="sm:col-span-2">
        <label for="from-date" class="block text-sm font-medium leading-6 text-white"
          >À Partir du</label
        >
        <div id="from-date" class="mt-2 mx-2 flex gap-x-8">
          <div>
            <label class="text-xs" for="day">Day</label>
            <input
              type="number"
              id="day"
              min="1"
              max="31"
              placeholder="DD"
              class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <label class="text-xs" for="month">Month</label>
            <input
              type="number"
              id="month"
              min="1"
              max="12"
              placeholder="MM"
              class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <label class="text-xs" for="year">Year</label>
            <input
              type="number"
              id="year"
              min="1800"
              max="3000"
              placeholder="YYYY"
              class="p-2 block w-28 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div class="sm:col-span-3 mt-2">
        <label for="to-date" class="block text-sm font-medium leading-6 text-white"
          >Jusqu'à</label
        >
        <div id="to-date" class="mt-2 mx-2 flex gap-x-8">
          <div>
            <label class="text-xs" for="day">Day</label>
            <input
              type="number"
              id="day"
              min="1"
              max="31"
              placeholder="DD"
              class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <label class="text-xs" for="month">Month</label>
            <input
              type="number"
              id="month"
              min="1"
              max="12"
              placeholder="MM"
              class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <label class="text-xs" for="year">Year</label>
            <input
              type="number"
              id="year"
              min="1800"
              max="3000"
              placeholder="YYYY"
              class="p-2 block w-28 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
				</div>
			</div>

			<div class="col-span-full mt-3">
				<label
					for="about"
					class="block text-sm font-medium text-white"
				>Description
				</label>
					<div id="description" class="mt-2 mx-2">
						<label class="text-xs font-medium text-white"
							>${originalLanguage.long}
						</label>
						<div
								id="description-${originalLanguage.short}"
								contenteditable="true"
								class="p-2 block w-full h-max min-h-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						></div>
						<div id="description-other-langs" class="mt-2"></div>
					</div>
        </div>
      </div>

		</div>
	</details>
	`;
  recordsDiv.appendChild(recordDiv);

  const recordName = recordDiv.querySelector(
    `#record-name-${originalLanguage.short}`
  ) as HTMLDivElement;

  recordName.addEventListener("input", updateRecordName);

  elementTranslationsRendererFor(recordName, true);

  function updateRecordName() {
    let name = "Enregistrement";
    if (recordName.innerText != "") {
      name = recordName.innerText;
    }

    const label = recordDiv.querySelector(`#record-label`) as HTMLSpanElement;
    label.innerHTML = name;
  }

  const description = recordDiv.querySelector(
    `#description-${originalLanguage.short}`
  ) as HTMLDivElement;
  elementTranslationsRendererFor(description, false);

  const deleteButton = recordDiv.querySelector("#delete") as HTMLButtonElement;
  deleteButton.addEventListener("click", () =>
    recordsDiv.removeChild(recordDiv)
  );

  return recordDiv;
}

function extractRecordData(
  language: string,
  record: Element
): CustomSectionsRecord {
  const recordName = record.querySelector(
    `#record-name-${language}`
  ) as HTMLDivElement;

  const startDate = extractDateFrom(
    record.querySelector("#from-date") as HTMLDivElement
  );

  const endDate = extractDateFrom(
    record.querySelector("#to-date") as HTMLDivElement
  );

  const description = record.querySelector(
    `#description-${language}`
  ) as HTMLDivElement;

  return {
    title: recordName ? recordName.innerText : null,
    startDate,
    endDate,
    content: description ? description.innerHTML : null,
  };
}

export function extractOtherSectionInto(data: CVProfileData, language: string) {
  const otherSectionsDiv = document.getElementById(
    "other-sections"
  ) as HTMLDivElement;

  const otherSections = otherSectionsDiv.querySelectorAll(
    "#other-sections-form"
  );

  if (otherSections.length > 0) {
    data.profile.customSections = [];
  }

  otherSections.forEach((otherSection) => {
    const id = generateUUID();
    const sectionName = otherSection.querySelector(
      `#section-name-${language}`
    ) as HTMLDivElement;
    if (!sectionName) return;
    const sectionData: CustomSection = {
      id,
      title: sectionName?.innerText,
    };

    data.profile.customSections?.push(sectionData);
    data.profile.preference.profileStructure.push(id);

    const records = otherSection.querySelectorAll("#other-record");
    if (records.length > 0) {
      sectionData.records = [];
    }

    records.forEach((record) => {
      const recordData = extractRecordData(language, record);
      sectionData.records?.push(recordData);
    });
  });

  data.profile.customSections;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function fillOtherSections(profiles: CVProfileData[]) {
  let originalProfile;
  for (const p of profiles) {
    if (p.profile.language == originalLanguage.short) originalProfile = p;
  }

  originalProfile?.profile.customSections?.forEach((section) => {
    const sectionDiv = renderOtherSectionForm(section.title);
    fillSectionName(sectionDiv, profiles, section);

    section.records?.forEach((record) => {
      const recordDiv = renderRecord(sectionDiv);

      (recordDiv.querySelector("#record-label") as HTMLSpanElement).innerText! =
        record.title!;

      const startDate = recordDiv.querySelector("#from-date") as HTMLDivElement;
      fillDate(record.startDate!, startDate);
      const endDate = recordDiv.querySelector("#to-date") as HTMLDivElement;
      fillDate(record.endDate!, endDate);

      const recordName = recordDiv.querySelector(
        `#record-name-${originalLanguage.short}`
      ) as HTMLDivElement;
      record.title && renderEmptyInputDivsForAllLanguages(recordName, true);

      const recordDescription = recordDiv.querySelector(
        `#description-${originalLanguage.short}`
      ) as HTMLDivElement;
      record.content &&
        renderEmptyInputDivsForAllLanguages(recordDescription, true);

      for (const p of profiles) {
        const langRecordName = recordDiv.querySelector(
          `#record-name-${p.profile.language}`
        );
        if (langRecordName instanceof HTMLDivElement)
          langRecordName.innerText = record.title!;
        const langRecordDescription = recordDiv.querySelector(
          `#description-${p.profile.language}`
        );
        if (langRecordDescription instanceof HTMLDivElement)
          langRecordDescription.innerHTML = record.content!;
      }
    });
  });
}
function fillSectionName(
  sectionDiv: HTMLDivElement,
  profiles: CVProfileData[],
  section: CustomSection
) {
  const sectionName = sectionDiv.querySelector(
    `#section-name-${originalLanguage.short}`
  ) as HTMLDivElement;
  renderEmptyInputDivsForAllLanguages(sectionName, true);
  for (const p of profiles) {
    const langSectionName = sectionDiv.querySelector(
      `#section-name-${p.profile.language}`
    );
    if (langSectionName instanceof HTMLDivElement)
      langSectionName.innerText = section.title;
  }
}
