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
  ) as HTMLElement;
  if (currentLangAboutMe)
    data.profile.personalInformation.personalDescription =
      currentLangAboutMe.innerHTML;

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
  data.profile.personalInformation.emails.push(email);

  extractPhoneInto(data);

  extractAddressInto(language, data);

  return data;
}

function extractAddressInto(language: string, data: CVProfileData) {
  const currentLangStreet = document.getElementById(
    `street-${language}`
  ) as HTMLElement;
  const city = (document.getElementById("city") as HTMLInputElement).value;
  const country = (document.getElementById("country") as HTMLSelectElement)
    .value;
  const postalCode = (
    document.getElementById("postal-code") as HTMLInputElement
  ).value;
  const address: Address = {
    addressName: null,
    addressPart1: currentLangStreet ? currentLangStreet.innerHTML : "",
    addressPart2: "",
    city,
    postalCode: postalCode,
    country,
    addressType: "home",
  };

  data.profile.personalInformation.addresses.push(address);
}

function extractPhoneInto(data: CVProfileData) {
  const phoneNumber = (
    document.getElementById("phone-number") as HTMLInputElement
  ).value;
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
interface SocialMediaWebsite {
  mediaType: string;
  mediaURL: string;
  customMediaType: string;
}

export interface Phone {
  phonePrefix: {
    countryCode: string;
    prefix: number;
  };
  phoneNumber: string;
  customPhoneNumberType: string;
  phoneNumberType: string;
}
interface Address {
  addressName: string | null;
  addressPart1: string;
  addressPart2: string;
  city: string;
  postalCode: string;
  country: string;
  addressType: string;
}
interface InstantMessenger {
  provider: string;
  id: string;
  customProvider: string;
}
interface DateOfBirth {
  date: string;
  dateType: string;
}
interface PersonalInformation {
  firstName: string;
  lastName: string;
  personalMottoLine: string | null;
  personalDescription: string;
  sex: string;
  nationalities: string[];
  socialMediaWebsites: SocialMediaWebsite[];
  emails: string[];
  phones: Phone[];
  addresses: Address[];
  websites: string[];
  instantMessengers: InstantMessenger[];
  dateOfBirth: DateOfBirth;
}
interface Preference {
  id: string;
  profileId: string;
  profileStructure: any[]; // Assuming profileStructure can be any array, adjust as needed
  dateFormat: string;
}
interface Template {
  displayLogo: string;
  displayPageNumber: boolean;
  color: string;
  fontSize: string;
  templateName: string;
}
interface Profile {
  language: string;
  personalInformation: PersonalInformation;
  preference: Preference;
  customSections: any[]; // Assuming customSections can be any array, adjust as needed
  userId: string;
}

export interface CVProfileData {
  id: null | string; // Assuming id can be null or a string, adjust as needed
  profile: Profile;
  template: Template;
}
