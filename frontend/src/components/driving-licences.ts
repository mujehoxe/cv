import { extractDateFrom } from "../utils/dateExtraction";
import { CVProfileData } from "../utils/formDataExtraction";

export function renderDrivingLicencesForm() {
  const drivingLicences = document.getElementById("driving-licences");
  drivingLicences!.innerHTML = `
    <div id='driving-licences-form'>
      <details>
        <summary class="text-base font-semibold leading-6 text-white cursor-pointer">Permis de Conduire</summary>
        <div id="driving-licences-container" class="flex flex-col px-4 gap-y-4 sm:gap-x-6 pt-4">
        </div>
      </details>
    </div>
 `;

  renderDrivingLicenceTypes();
}

function renderDrivingLicenceType(
  licenceType: string,
  specs: Spec[],
  ageRestriction: string
) {
  const licenceContainer = document.createElement("div");
  licenceContainer.classList.add(
    "col-12",
    "py-1",
    "px-4",
    "driving-licence-item"
  );

  licenceContainer.innerHTML = `
    <div class="flex flex-col bg-zinc-800 p-2 rounded-md items-center space-x-4">
      <div class="flex flex-row items-center w-full">
        <input id="${licenceType}" type="checkbox" class="h-4 w-4 text-blue-600" aria-required="false" aria-label="Add licence ${licenceType} to your profile" aria-invalid="false" />
        <div class="select-none flex items-center w-full justify-between">
          <div class="flex items-center space-x-2">
            <i class="fas"></i> <!-- Driving licence type icon -->
            <i class="fas fa-id-card"></i> <!-- Identity icon -->
            <span class="font-bold text-lg">${licenceType}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 min-w-[50%] min-h-[72px] text-sm">
            ${specs
              .map(
                (spec: Spec) =>
                  `<div class="flex items-center space-x-2"><i class="far ${
                    spec.type === "maxSpeed"
                      ? "fa-tachometer-alt"
                      : spec.type === "energy"
                      ? "fa-bolt"
                      : spec.type === "weight"
                      ? "fa-weight-hanging"
                      : spec.type === "people"
                      ? "fa-users"
                      : spec.type === "maxLength"
                      ? "fa-ruler-horizontal"
                      : spec.type === "load"
                      ? "fa-trailer"
                      : "fa-info-circle"
                  }"></i><span>${spec.value}</span></div>`
              )
              .join("")}
          </div>
          <div class="flex items-center space-x-2"><i class="fas fa-id-card"></i><span>${ageRestriction}</span></div>
        </div>
      </div>

      <div class="hidden flex-row space-x-8 divide-x max-h-16" id="licence-dates">
        <div class="sm:col-span-2 flex flex-row items-center align-middle p-4">
          <i class="fas fa-calendar-check mx-2 text-xl"></i>
          <div id="from-date" class="flex gap-x-8">
            <div>
              <label class="text-xs" for="day">Day</label>
              <input
                  type="number"
                  id="day"
                  min="1" max="31"
                  placeholder="DD"
                  class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label class="text-xs" for="month">Month</label>
              <input 
                  type="number"
                  id="month"
                  min="1" max="12"
                  placeholder="MM"
                  class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label class="text-xs" for="year">Year</label>
              <input 
                  type="number"
                  id="year"
                  min="1800" max="3000"
                  placeholder="YYYY"
                  class="p-2 block w-28 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div class="sm:col-span-2 flex flex-row items-center align-middle p-4">
          <i class="fas fa-calendar-times mx-2 text-xl"></i>
          <div id="to-date" class="flex gap-x-8">
            <div>
              <label class="text-xs" for="day">Day</label>
              <input 
                type="number"
                    id="day"
                    min="1" max="31"
                    placeholder="DD"
                    class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label class="text-xs" for="month">Month</label>
              <input 
                    type="number"
                    id="month"
                    min="1" max="12"
                    placeholder="MM"
                    class="p-2 block w-20 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label class="text-xs" for="year">Year</label>
              <input 
                  type="number"
                  id="year"
                  min="1800" max="3000"
                  placeholder="YYYY"
                  class="p-2 block w-28 rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>
    .driving-licence-item {
      transition: transform 0.3s ease;
     }
     
     .driving-licence-item:hover {
      transform: scale(1.02);
     }
    </style>
  `;

  const checkbox = licenceContainer.querySelector(
    `#${licenceType}`
  ) as HTMLInputElement;
  checkbox.disabled = true;

  licenceContainer.children[0].children[0].addEventListener(
    "click",
    function () {
      checkbox.checked = !checkbox.checked;
      const datesContainer = licenceContainer.querySelector(
        `#licence-dates`
      ) as HTMLDivElement;

      datesContainer.classList.toggle("hidden");
      datesContainer.classList.toggle("flex");
    }
  );

  return licenceContainer;
}

function renderDrivingLicenceTypes() {
  const drivingLicencesContainer = document.getElementById(
    "driving-licences-container"
  );

  Object.entries(categories).forEach(([categoryName, licences]) => {
    renderCategoryHeader(categoryName);
    licences.forEach((licence) => {
      const licenceElement = renderDrivingLicenceType(
        licence.type,
        licence.specs,
        licence.ageRestriction
      );
      drivingLicencesContainer?.appendChild(licenceElement);
    });
  });
}

function renderCategoryHeader(categoryName: string) {
  const categoryHeader = document.createElement("div");
  categoryHeader.id = `${categoryName}-header`;
  categoryHeader.classList.add("font-medium", "text-lg");
  categoryHeader.textContent = categoryName.toUpperCase();
  document
    .getElementById("driving-licences-container")
    ?.appendChild(categoryHeader);
}

export function extractDrivingLicencesInto(data: CVProfileData) {
  const drivingLicencesContainer = document.getElementById(
    "driving-licences-container"
  )!;
  const drivingLicences = drivingLicencesContainer.querySelectorAll(
    ".driving-licence-item"
  );

  if (drivingLicences.length > 0) {
    data.profile.preference.profileStructure.push("driving-licence");
  }

  drivingLicences.forEach((drivingLicence) => {
    const checkbox = drivingLicence.querySelector(
      "input[type='checkbox']"
    ) as HTMLInputElement;
    if (checkbox.checked) {
      const licenceType = checkbox.id;
      const startDateDiv = drivingLicence.querySelector(
        `#from-date`
      ) as HTMLInputElement;
      const startDate = extractDateFrom(startDateDiv);

      const endDateDiv = drivingLicence.querySelector(
        `#to-date`
      ) as HTMLInputElement;
      const endDate = extractDateFrom(endDateDiv);

      const drivingLicenceData = {
        licence: licenceType,
        timeRange: { startDate, endDate },
      };

      data.profile.drivingLicence = data.profile.drivingLicence || {
        licences: [],
      };
      data.profile.drivingLicence.licences.push(drivingLicenceData);
    }
  });
}

const motorbikeLicences = [
  {
    type: "AM",
    specs: [
      { type: "capacity", value: "< 50 cm³" },
      { type: "speed", value: "< 45km/h" },
      { type: "energy", value: "< 4kW" },
    ],
    ageRestriction: "16+",
  },
  {
    type: "A1",
    specs: [
      { type: "capacity", value: "< 125 cm³" },
      { type: "energy", value: "< 11 kW - 0.1 kW/kg" },
    ],
    ageRestriction: "16+",
  },
  {
    type: "A2",
    specs: [{ type: "energy", value: "< 35 kW - 0.2 kW/kg" }],
    ageRestriction: "18+",
  },
  {
    type: "A",
    specs: [{ type: "energy", value: "> 35 kW - 0.2 kW/kg" }],
    ageRestriction: "20/24+",
  },
];

const carLicences = [
  {
    type: "B1",
    specs: [
      { type: "energy", value: "< 15 kW" },
      { type: "weight", value: "<400/500 kg" },
    ],
    ageRestriction: "16+",
  },
  {
    type: "B",
    specs: [
      { type: "weight", value: "< 3500 kg" },
      { type: "people", value: "8+1" },
      { type: "load", value: "< 750 kg" },
    ],
    ageRestriction: "18+",
  },
  {
    type: "BE",
    specs: [
      { type: "weight", value: "< 3500 kg" },
      { type: "people", value: "8+1" },
      { type: "load", value: "> 750 kg" },
    ],
    ageRestriction: "18+",
  },
];

const truckLicences = [
  {
    type: "C1",
    specs: [
      { type: "weight", value: "< 7500 kg" },
      { type: "people", value: "8+1" },
      { type: "load", value: "< 750 kg" },
    ],
    ageRestriction: "18+",
  },
  {
    type: "C1E",
    specs: [
      { type: "weight", value: "< 12000 kg" },
      { type: "people", value: "8+1" },
      { type: "load", value: "> 750 kg" },
    ],
    ageRestriction: "18+",
  },
  {
    type: "C",
    specs: [
      { type: "weight", value: "> 3500 kg" },
      { type: "people", value: "8+1" },
      { type: "load", value: "< 750 kg" },
    ],
    ageRestriction: "21+",
  },
  {
    type: "CE",
    specs: [
      { type: "weight", value: "> 3500 kg" },
      { type: "people", value: "8+1" },
      { type: "load", value: "> 750 kg" },
    ],
    ageRestriction: "21+",
  },
];

const othersLicences = [
  {
    type: "D1",
    specs: [
      { type: "people", value: "16+1" },
      { type: "maxLength", value: "8m" },
      { type: "load", value: "< 750 kg" },
    ],
    ageRestriction: "21+",
  },
  {
    type: "D1E",
    specs: [
      { type: "people", value: "16+1" },
      { type: "maxLength", value: "8m" },
      { type: "load", value: "> 750 kg" },
    ],
    ageRestriction: "21+",
  },
  {
    type: "D",
    specs: [{ type: "load", value: "< 750 kg" }],
    ageRestriction: "24+",
  },
  {
    type: "DE",
    specs: [{ type: "load", value: "> 750 kg" }],
    ageRestriction: "24+",
  },
];

const categories = {
  Motorbikes: motorbikeLicences,
  Cars: carLicences,
  Trucks: truckLicences,
  Others: othersLicences,
};

interface Spec {
  type: string;
  value: string;
}
