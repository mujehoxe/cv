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
