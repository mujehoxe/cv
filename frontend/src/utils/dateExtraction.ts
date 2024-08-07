import { extractPhoneInto } from "../components/cover-letter/dataExtraction";
import { DataDate } from "./formDataExtraction";
import { formLanguages } from "./languages";

export function extractDateFrom(parent: HTMLDivElement): DataDate | null {
  let day = (parent.querySelector("#day") as HTMLInputElement)?.value;
  let month = (parent.querySelector("#month") as HTMLInputElement)?.value;
  const year = (parent.querySelector("#year") as HTMLInputElement)?.value;

  if (day?.length === 1) day = `0${day}`;
  if (month?.length === 1) month = `0${month}`;

  if (day && month && year) {
    return {
      date: `${year}-${month}-${day}T00:00:00.000Z`,
      dateType: "DAY",
    };
  } else if (year) {
    return {
      date: `${year}-01-01T00:00:00.000Z`,
      dateType: "YEAR",
    };
  }

  return null;
}

export function fillDate(date?: DataDate, parent?: HTMLDivElement) {
  if (!date || !parent) return;

  const [year, month, dayWithTime] = date.date.split("-");

  const yearInput = parent.querySelector("#year") as HTMLInputElement;
  yearInput.value = year;

  if (date.dateType == "DAY") {
    const [day, _] = dayWithTime.split("T");
    const dayInput = parent.querySelector("#day") as HTMLInputElement;
    const monthInput = parent.querySelector("#month") as HTMLInputElement;
    dayInput.value = day;
    monthInput.value = month;
  }
}
export function extractCoverInfo(coverInfoForm: HTMLFormElement, countriesSelect: HTMLSelectElement, streetInput: HTMLDivElement, objectInput: HTMLDivElement, contentInput: HTMLDivElement) {
  const data: any = {};
  data.firstName = (coverInfoForm.querySelector('[name=first-name]') as HTMLInputElement).value;
  data.lastName = (coverInfoForm.querySelector('[name=last-name]') as HTMLInputElement).value;
  data.lastName = (coverInfoForm.querySelector('[name=last-name]') as HTMLInputElement).value;
  data.birthday = extractDateFrom(coverInfoForm.querySelector('#birthday') as HTMLInputElement);
  data.email = (coverInfoForm.querySelector('[name=email]') as HTMLInputElement).value;
  extractPhoneInto(data, coverInfoForm);
  data.city = (coverInfoForm.querySelector('[name=city]') as HTMLInputElement).value;
  data.zip = (coverInfoForm.querySelector('[name=postal-code]') as HTMLInputElement).value;
  data.country = countriesSelect.value;

  for (const language in formLanguages) {
    data.language = language;
    data.street = streetInput.innerText;
    data.object = objectInput.innerText;
    data.content = contentInput.innerText;
  }
}
