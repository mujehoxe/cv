import { DataDate } from "./formDataExtraction";

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

export function fillDate(date: DataDate, parent: HTMLDivElement) {
  const [year, month, day] = date.date.split("-");

  const dayInput = parent.querySelector("#day") as HTMLInputElement;
  const monthInput = parent.querySelector("#month") as HTMLInputElement;
  const yearInput = parent.querySelector("#year") as HTMLInputElement;

  dayInput.value = day;
  monthInput.value = month;
  yearInput.value = year;
}
