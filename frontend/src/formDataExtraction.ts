import { CVProfileData, Phone } from "./cv-profile-types";

export function extractFormData(language: string) {
  const data: CVProfileData = {
    id: null,
    profile: {
      language: language,
      personalInformation: {
        firstName: "kldsfjlkdsq",
        lastName: "klsdjflkds",
        personalMottoLine: null,
        personalDescription: "",
        sex: "male",
        nationalities: [],
        socialMediaWebsites: [
          {
            mediaType: "facebook",
            mediaURL: "https://facebook.com/jkhkjhkj",
            customMediaType: "",
          },
          {
            mediaType: "linkedin",
            mediaURL: "https://linkedin.com/in/lksdjflk",
            customMediaType: "",
          },
        ],
        emails: [],
        phones: [],
        addresses: [
          {
            addressName: null,
            addressPart1: "Strret name 65, avnue",
            addressPart2: "Strret name 65, avnue",
            city: "Paris",
            postalCode: "253321",
            country: "be",
            addressType: "home",
          },
          {
            addressName: null,
            addressPart1: "Strret name 65, avnue",
            addressPart2: "",
            city: "paris",
            postalCode: "23432",
            country: "be",
            addressType: "work",
          },
        ],
        websites: ["www.hdksfj.com"],
        instantMessengers: [
          { provider: "whatsapp", id: "+23654643232", customProvider: "" },
        ],
        dateOfBirth: { date: "2005-05-11T00:00:00.000Z", dateType: "DAY" },
      },
      preference: {
        id: "",
        profileId: "",
        profileStructure: [],
        dateFormat: "dd/MM/yyyy",
      },
      customSections: [],
      userId: "65e8e7e9e40eb67cd85645d3",
    },
    template: {
      displayLogo: "first",
      displayPageNumber: false,
      color: "none",
      fontSize: "medium",
      templateName: "cv-3",
    },
  };

  data.profile.personalInformation.firstName = (
    document.getElementById("first-name") as HTMLInputElement
  ).value;

  data.profile.personalInformation.lastName = (
    document.getElementById("last-name") as HTMLInputElement
  ).value;

  const currentLangAboutMe = document.getElementById(
    `about-${language}`
  )?.innerText;
  if (currentLangAboutMe)
    data.profile.personalInformation.personalDescription = currentLangAboutMe;

  const birthday = (document.getElementById("birthday") as HTMLInputElement)
    .value;
  if (birthday != "")
    data.profile.personalInformation.dateOfBirth.date = birthday;

  const gender = (document.getElementById("gender") as HTMLInputElement).value;
  if (gender == "male" || gender == "female")
    data.profile.personalInformation.sex = gender;

  const nationalitySelect = document.getElementById(
    "nationality"
  ) as HTMLSelectElement;
  nationalitySelect &&
    data.profile.personalInformation.nationalities.push(
      nationalitySelect.value
    );

  const email = (document.getElementById("email") as HTMLInputElement).value;
  email && data.profile.personalInformation.emails.push(email);

  const phoneNumber = (
    document.getElementById("phone-number") as HTMLInputElement
  ).value;

  extractPhone(phoneNumber, data);

  return data;
}

function extractPhone(phoneNumber: string, data: CVProfileData) {
  if (phoneNumber != "") {
    const phoneExtentionSelect = document.getElementById(
      "phone-extention"
    ) as HTMLSelectElement;

    const phone: Phone = {
      phoneNumber,
      phonePrefix: JSON.parse(phoneExtentionSelect.value),
      customPhoneNumberType: "",
      phoneNumberType: "mobile",
    };

    phoneExtentionSelect && data.profile.personalInformation.phones.push(phone);
  }
}
