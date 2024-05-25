import { main } from "../../wailsjs/go/models";
import { fillDigitalSkills } from "../components/form-page/digital-skills";
import { fillDrivingLicences } from "../components/form-page/driving-licences";
import { fillEducationTranings } from "../components/form-page/education-tranings";
import {
  fillAboutMe,
  fillAddress,
  fillPersonalInfo,
  fillProfileImage,
} from "../components/form-page/form";
import { fillHobbies } from "../components/form-page/hobbies";
import { fillLanguageSkills } from "../components/form-page/language-skills";
import { fillOtherSections } from "../components/form-page/other-section";
import { fillWorkExperiences } from "../components/form-page/work-experience";
import { CVProfileData } from "./formDataExtraction";

export function fillFormUsingDBProfiles(dbProfiles: main.Profile[]) {
  //map transform main.Profile[] to CVProfileData[]
  const profiles: CVProfileData[] = dbProfiles.map((profile) => {
    if (profile.json.String == "" || !profile.json.Valid) return {};
    return JSON.parse(profile.json.String);
  });

  fillLanguageAgnosticFields(profiles[0]);

  fillLanguageSpecificFields(profiles);
}

export function fillFormUsingProfiles(profiles: CVProfileData[]) {
  fillLanguageAgnosticFields(profiles[0]);
  fillLanguageSpecificFields(profiles);
}

function fillLanguageAgnosticFields(profile: CVProfileData) {
  fillPersonalInfo(profile.profile?.personalInformation);
  fillProfileImage(profile.profilePicture);
  fillDrivingLicences(profile.profile?.drivingLicence?.licences);
  fillLanguageSkills(profile.profile?.languageSkills);
  fillDigitalSkills(profile.profile?.digitalSkills?.other);
}

function fillLanguageSpecificFields(profiles: CVProfileData[]) {
  fillAboutMe(profiles);
  fillAddress(profiles);
  fillWorkExperiences(profiles);
  fillEducationTranings(profiles);
  fillHobbies(profiles);
  fillOtherSections(profiles);
}
