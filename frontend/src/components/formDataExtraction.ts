import { extractDrivingLicencesInto } from "./driving-licences";
import { extractEducationTrainingsInto } from "./education-tranings";
import { extractWorkExperiencesInto } from "./work-experience";

export function extractProfileInfo(language: string) {
  const firstName = (document.getElementById("first-name") as HTMLInputElement)
    .value;
  const lastName = (document.getElementById("last-name") as HTMLInputElement)
    .value;
  const personalDescription =
    (document.getElementById(`about-${language}`) as HTMLElement)?.innerHTML ||
    "";
  const sex =
    (document.getElementById("gender") as HTMLInputElement).value === "male" ||
    (document.getElementById("gender") as HTMLInputElement).value === "female"
      ? (document.getElementById("gender") as HTMLInputElement).value
      : undefined;
  const nationalities = [
    (document.getElementById("nationality") as HTMLSelectElement).value,
  ];
  const emails = [(document.getElementById("email") as HTMLInputElement).value];
  const dateOfBirth = (document.getElementById("birthday") as HTMLInputElement)
    .value
    ? {
        date: (document.getElementById("birthday") as HTMLInputElement).value,
        dateType: "DAY",
      }
    : null;

  const data: CVProfileData = {
    profile: {
      language: language,
      personalInformation: {
        firstName,
        lastName,
        personalDescription,
        sex,
        nationalities,
        emails,
        dateOfBirth,
      },
      preference: {
        profileStructure: [],
        dateFormat: "dd/MM/yyyy",
      },
      customSections: [],
    },
    template: {
      displayLogo: "first",
      displayPageNumber: false,
      fontSize: "medium",
      templateName: "cv-3",
    },
  };

  extractPhoneInto(data);
  extractAddressInto(language, data);
  extractWorkExperiencesInto(language, data);
  extractEducationTrainingsInto(language, data);
  extractDrivingLicencesInto(data);

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

  data.profile.personalInformation.addresses = [address];
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

    if (phoneExtentionSelect) data.profile.personalInformation.phones = [phone];
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
  personalDescription?: string;
  sex?: string;
  nationalities?: string[];
  socialMediaWebsites?: SocialMediaWebsite[];
  emails?: string[];
  phones?: Phone[];
  addresses?: Address[];
  websites?: string[];
  instantMessengers?: InstantMessenger[];
  dateOfBirth?: DateOfBirth | null;
}

interface Preference {
  profileStructure: string[];
  dateFormat: string;
}

interface Template {
  displayLogo: string;
  displayPageNumber: boolean;
  color?: string;
  fontSize: string;
  templateName: string;
}

export interface WorkExperience {
  order?: string | null;
  occupation: {
    label: string;
    uri: string | null;
  };
  employer: string;
  startDate?: {
    date: string;
    dateType: string;
  } | null;
  ongoing?: boolean;
  mainActivities?: string | null;
  organisationAddress: {
    city?: string;
    country?: string;
  };
  endDate?: {
    date: string;
    dateType: string;
  } | null;
}

export interface EducationTraining {
  qualification?: string;
  organisationName?: string;
  city?: string;
  country?: string;
  website?: string | null;
  startDate?: {
    date: string;
    dateType: string;
  } | null;
  endDate?: {
    date: string;
    dateType: string;
  } | null;
  ongoing?: boolean | null;
  studyFields?: {
    content: string;
    studyFieldCategoryType: string;
  }[];
}

export interface DrivingLicence {
  licence: string;
  timeRange: {
    startDate: { date: string; dateType: string } | null;
    endDate: { date: string; dateType: string } | null;
  };
}

export interface Licence {
  licences: DrivingLicence[];
}

interface Profile {
  language: string;
  personalInformation: PersonalInformation;
  preference: Preference;
  customSections: any[];
  workExperiences?: WorkExperience[];
  educationTrainings?: EducationTraining[];
  drivingLicence?: Licence;
}

export interface CVProfileData {
  id?: null | string;
  profile: Profile;
  template: Template;
}
