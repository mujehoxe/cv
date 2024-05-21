import { main } from "../../wailsjs/go/models";
import { fillDigitalSkills } from "../components/form-page/digital-skills";
import { fillDrivingLicences } from "../components/form-page/driving-licences";
import {
  fillAboutMe,
  fillPersonalInfo,
  fillProfileImage,
} from "../components/form-page/form";
import { fillLanguageSkills } from "../components/form-page/language-skills";
import { CVProfileData } from "./formDataExtraction";

export function fillForm(dbProfiles: main.Profile[]) {
  //map transform main.Profile[] to CVProfileData[]
  const profiles: CVProfileData[] = dbProfiles.map((profile) => {
    if (profile.json.String == "" || !profile.json.Valid) return {};
    return JSON.parse(profile.json.String);
  });

  fillPersonalInfo(profiles[0].profile.personalInformation);
  fillProfileImage(profiles[0].profilePicture);
  fillDrivingLicences(profiles[0].profile.drivingLicence?.licences);
  fillLanguageSkills(profiles[0].profile.languageSkills);
  fillDigitalSkills(profiles[0].profile.digitalSkills?.other);
  fillLanguageSpecificFields(profiles);
}

function fillLanguageSpecificFields(profiles: CVProfileData[]) {
  fillAboutMe(profiles);
}
