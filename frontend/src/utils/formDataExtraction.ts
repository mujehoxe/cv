import { extractDateFrom } from "./dateExtraction";
import { extractDigitalSkillsData as extractDigitalSkillsInto } from "../components/form-page/digital-skills";
import { extractDrivingLicencesInto } from "../components/form-page/driving-licences";
import { extractEducationTrainingsInto } from "../components/form-page/education-tranings";
import { extractLanguageSkillsData as extractLanguageSkillsInto } from "../components/form-page/language-skills";
import { extractWorkExperiencesInto } from "../components/form-page/work-experience";
import { extractHobbiesInto } from "../components/form-page/hobbies";
import { extractOtherSectionInto } from "../components/form-page/other-section";

export function extractProfileInfo() {
  const form = document.getElementById("info-form")!;

  const profilePicture = (
    form.querySelector("#preview-img") as HTMLImageElement
  ).src;

  const firstName = (form.querySelector("#first-name") as HTMLInputElement)
    .value;
  const lastName = (form.querySelector("#last-name") as HTMLInputElement).value;

  const gender = (form.querySelector("#gender") as HTMLInputElement).value;
  const sex =
    gender === "male" || gender === "female"
      ? (form.querySelector("#gender") as HTMLInputElement).value
      : undefined;
  const nationalities = [
    (form.querySelector("#nationality") as HTMLSelectElement).value,
  ];
  const emails = [(form.querySelector("#email") as HTMLInputElement).value];

  const birthDiv = form.querySelector("#birthday") as HTMLDivElement;
  const dateOfBirth = extractDateFrom(birthDiv);

  const data: CVProfileData = {
    profile: {
      language: "",
      personalInformation: {
        firstName,
        lastName,
        sex,
        nationalities,
        emails,
        dateOfBirth,
      },
      preference: {
        profileStructure: [],
        dateFormat: "dd/MM/yyyy",
      },
    },
    profilePicture:
      profilePicture && profilePicture != "" ? profilePicture : null,
    template: {
      closingStatement: null,
      color: "dark-blue",
      displayLogo: "first",
      displayPageNumber: false,
      fontSize: "large",
      templateName: "cv-3",
    },
  };

  extractPhoneInto(data);
  extractDrivingLicencesInto(data);
  extractLanguageSkillsInto(data);
  extractDigitalSkillsInto(data);

  return data;
}

export function extractLanguageSpecificData(
  data: CVProfileData,
  language: string
) {
  const personalDescription =
    (document.getElementById(`about-${language}`) as HTMLElement)?.innerHTML ||
    "";

  data.profile.language = language;
  data.profile.personalInformation.personalDescription = personalDescription;

  extractAddressInto(data, language);
  extractWorkExperiencesInto(data, language);
  extractEducationTrainingsInto(data, language);
  extractHobbiesInto(data, language);
  extractOtherSectionInto(data, language);
}

function extractAddressInto(data: CVProfileData, language: string) {
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
    addressPart1: currentLangStreet ? currentLangStreet.innerText : "",
    addressPart2: "",
    city,
    postalCode: postalCode,
    country,
    addressType: "home",
  };

  data.profile.personalInformation.addresses = [address];
}

function extractPhoneInto(data: CVProfileData) {
  const phoneNumbers = document.querySelectorAll("#phone-number");
  if (phoneNumbers.length > 0) data.profile.personalInformation.phones = [];

  phoneNumbers.forEach((phoneNumberInput, key) => {
    const phoneNumber = (phoneNumberInput as HTMLInputElement).value;
    const phoneExtentionSelect =
      document.querySelectorAll("#phone-extention")[key];
    if (phoneNumber != "") {
      const phone: Phone = {
        phoneNumber,
        phonePrefix: JSON.parse(
          (phoneExtentionSelect as HTMLInputElement).value
        ),
        customPhoneNumberType: "",
        phoneNumberType: "mobile",
      };

      data.profile.personalInformation.phones!.push(phone);
    }
  });
}

interface SocialMediaWebsite {
  mediaType: string;
  mediaURL: string;
  customMediaType: string;
}

export interface Phone {
  phonePrefix?: {
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

export interface DataDate {
  date: string;
  dateType: string;
}

export interface PersonalInformation {
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
  dateOfBirth?: DataDate | null;
}

interface Preference {
  profileStructure: string[];
  dateFormat: string;
}

interface Template {
  closingStatement?: string | null;
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
  } | null;
  employer: string | null;
  startDate?: DataDate | null;
  ongoing?: boolean;
  mainActivities?: string | null;
  organisationAddress: {
    city?: string;
    country?: string;
  };
  endDate?: DataDate | null;
}

export interface Hobby {
  title: string;
}

export interface EducationTraining {
  qualification?: string;
  organisationName?: string;
  city?: string;
  country?: string;
  website?: string | null;
  startDate?: DataDate | null;
  endDate?: DataDate | null;
  ongoing?: boolean | null;
  studyFields?: {
    content: string;
    studyFieldCategoryType: string;
  }[];
}

export interface DrivingLicence {
  licence: string;
  timeRange: {
    startDate: DataDate | null;
    endDate: DataDate | null;
  };
}

export interface Licence {
  licences: DrivingLicence[];
}

export interface LanguageSkill {
  language: string;
  languageCategory: string;
}

export type NonNativeLang = LanguageSkill & {
  language: string;
  listening: string;
  reading: string;
  spokenInteraction: string;
  spokenProduction: string;
  writing: string;
  languageCategory: string;
};

export interface LanguageSkills {
  nativeLanguages: LanguageSkill[];
  otherLanguages?: NonNativeLang[];
}

export interface CustomSectionsRecord {
  title?: string | null;
  content?: string | null;
  startDate?: DataDate | null;
  endDate?: DataDate | null;
}

export interface CustomSection {
  id: string;
  title: string;
  records?: CustomSectionsRecord[] | null;
}

interface Profile {
  language: string;
  personalInformation: PersonalInformation;
  preference: Preference;
  customSections?: CustomSection[];
  workExperiences?: WorkExperience[];
  educationTrainings?: EducationTraining[];
  drivingLicence?: Licence;
  languageSkills?: LanguageSkills;
  digitalSkills?: {
    other: string[];
  };
  hobbiesInterests?: Hobby[];
}

export interface CVProfileData {
  id?: null | string;
  profile: Profile;
  profilePicture?: null | string;
  template: Template;
  errors?: any;
}
