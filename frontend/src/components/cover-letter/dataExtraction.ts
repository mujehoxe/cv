import { extractDateFrom } from "../../utils/dateExtraction";
import { Phone } from "../../utils/formDataExtraction";

export function extractPhoneInto(data: any, parent: HTMLElement){
  const phoneNumbers = parent.querySelectorAll("#phone-number");
  if (phoneNumbers.length > 0) data.phones = [];

  phoneNumbers.forEach((phoneNumberInput, key) => {
    const phoneNumber = (phoneNumberInput as HTMLInputElement).value;
    const phoneExtentionSelect =
    parent.querySelectorAll("#phone-extention")[key];
    if (phoneNumber != "") {
      const phone: Phone = {
        phoneNumber,
        phonePrefix: JSON.parse(
          (phoneExtentionSelect as HTMLInputElement).value
        ),
        customPhoneNumberType: "",
        phoneNumberType: "mobile",
      };

      data.phones!.push(phone);
    }
  });
}

export function extractCoverLanguageAgnosticInfo(coverInfoForm: HTMLFormElement) {
  const data: any = {};
  data.firstName = (coverInfoForm.querySelector('[name=first-name]') as HTMLInputElement).value;
  data.lastName = (coverInfoForm.querySelector('[name=last-name]') as HTMLInputElement).value;
  data.lastName = (coverInfoForm.querySelector('[name=last-name]') as HTMLInputElement).value;
  data.birthday = extractDateFrom(coverInfoForm.querySelector('#birthday') as HTMLInputElement);
  data.email = (coverInfoForm.querySelector('[name=email]') as HTMLInputElement).value;
  extractPhoneInto(data, coverInfoForm);
  data.city = (coverInfoForm.querySelector('[name=city]') as HTMLInputElement).value;
  data.zip = (coverInfoForm.querySelector('[name=postal-code]') as HTMLInputElement).value;

	const countriesSelect = coverInfoForm.querySelector("#country") as HTMLSelectElement;
  data.country = countriesSelect.value;

	return data;
}

export function exportCoverLanguageSpecificInfo(data: any, language: string, coverInfoForm: HTMLFormElement) {
  data.language = language;
  data.street = (coverInfoForm.querySelector(
    `#street-${language}`
  ) as HTMLDivElement)?.innerText;
  data.object = (coverInfoForm.querySelector(
    `#object-${language}`
  ) as HTMLDivElement)?.innerText;
  data.content = (coverInfoForm.querySelector(
    `#content-${language}`
  ) as HTMLDivElement)?.innerText;
}
