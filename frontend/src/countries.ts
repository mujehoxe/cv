const countries: Country[] = [
  { name: "Afghanistan", cca2: "AF", idd: "+93" },
  { name: "Albania", cca2: "AL", idd: "+355" },
  { name: "Algeria", cca2: "DZ", idd: "+213" },
  { name: "American Samoa", cca2: "AS", idd: "+1684" },
  { name: "Andorra", cca2: "AD", idd: "+376" },
  { name: "Angola", cca2: "AO", idd: "+244" },
  { name: "Anguilla", cca2: "AI", idd: "+1264" },
  { name: "Antigua and Barbuda", cca2: "AG", idd: "+1268" },
  { name: "Argentina", cca2: "AR", idd: "+54" },
  { name: "Armenia", cca2: "AM", idd: "+374" },
  { name: "Aruba", cca2: "AW", idd: "+297" },
  { name: "Australia", cca2: "AU", idd: "+61" },
  { name: "Austria", cca2: "AT", idd: "+43" },
  { name: "Azerbaijan", cca2: "AZ", idd: "+994" },
  { name: "Bahamas", cca2: "BS", idd: "+1242" },
  { name: "Bahrain", cca2: "BH", idd: "+973" },
  { name: "Bangladesh", cca2: "BD", idd: "+880" },
  { name: "Barbados", cca2: "BB", idd: "+1246" },
  { name: "Belarus", cca2: "BY", idd: "+375" },
  { name: "Belgium", cca2: "BE", idd: "+32" },
  { name: "Belize", cca2: "BZ", idd: "+501" },
  { name: "Benin", cca2: "BJ", idd: "+229" },
  { name: "Bermuda", cca2: "BM", idd: "+1441" },
  { name: "Bhutan", cca2: "BT", idd: "+975" },
  { name: "Bolivia", cca2: "BO", idd: "+591" },
  { name: "Bosnia and Herzegovina", cca2: "BA", idd: "+387" },
  { name: "Botswana", cca2: "BW", idd: "+267" },
  { name: "Bouvet Island", cca2: "BV", idd: "+47" },
  { name: "Brazil", cca2: "BR", idd: "+55" },
  { name: "British Indian Ocean Territory", cca2: "IO", idd: "+246" },
  { name: "British Virgin Islands", cca2: "VG", idd: "+1284" },
  { name: "Brunei", cca2: "BN", idd: "+673" },
  { name: "Bulgaria", cca2: "BG", idd: "+359" },
  { name: "Burkina Faso", cca2: "BF", idd: "+226" },
  { name: "Burundi", cca2: "BI", idd: "+257" },
  { name: "Cambodia", cca2: "KH", idd: "+855" },
  { name: "Cameroon", cca2: "CM", idd: "+237" },
  { name: "Canada", cca2: "CA", idd: "+1" },
  { name: "Cape Verde", cca2: "CV", idd: "+238" },
  { name: "Caribbean Netherlands", cca2: "BQ", idd: "+599" },
  { name: "Cayman Islands", cca2: "KY", idd: "+1345" },
  { name: "Central African Republic", cca2: "CF", idd: "+236" },
  { name: "Chad", cca2: "TD", idd: "+235" },
  { name: "Chile", cca2: "CL", idd: "+56" },
  { name: "China", cca2: "CN", idd: "+86" },
  { name: "Christmas Island", cca2: "CX", idd: "+61" },
  { name: "Cocos (Keeling) Islands", cca2: "CC", idd: "+61" },
  { name: "Colombia", cca2: "CO", idd: "+57" },
  { name: "Comoros", cca2: "KM", idd: "+269" },
  { name: "Cook Islands", cca2: "CK", idd: "+682" },
  { name: "Costa Rica", cca2: "CR", idd: "+506" },
  { name: "Croatia", cca2: "HR", idd: "+385" },
  { name: "Cuba", cca2: "CU", idd: "+53" },
  { name: "Curaçao", cca2: "CW", idd: "+599" },
  { name: "Cyprus", cca2: "CY", idd: "+357" },
  { name: "Czechia", cca2: "CZ", idd: "+420" },
  { name: "DR Congo", cca2: "CD", idd: "+243" },
  { name: "Denmark", cca2: "DK", idd: "+45" },
  { name: "Djibouti", cca2: "DJ", idd: "+253" },
  { name: "Dominica", cca2: "DM", idd: "+1767" },
  { name: "Dominican Republic", cca2: "DO", idd: "+1809" },
  { name: "Ecuador", cca2: "EC", idd: "+593" },
  { name: "Egypt", cca2: "EG", idd: "+20" },
  { name: "El Salvador", cca2: "SV", idd: "+503" },
  { name: "Equatorial Guinea", cca2: "GQ", idd: "+240" },
  { name: "Eritrea", cca2: "ER", idd: "+291" },
  { name: "Estonia", cca2: "EE", idd: "+372" },
  { name: "Eswatini", cca2: "SZ", idd: "+268" },
  { name: "Ethiopia", cca2: "ET", idd: "+251" },
  { name: "Falkland Islands", cca2: "FK", idd: "+500" },
  { name: "Faroe Islands", cca2: "FO", idd: "+298" },
  { name: "Fiji", cca2: "FJ", idd: "+679" },
  { name: "Finland", cca2: "FI", idd: "+358" },
  { name: "France", cca2: "FR", idd: "+33" },
  { name: "French Guiana", cca2: "GF", idd: "+594" },
  { name: "French Polynesia", cca2: "PF", idd: "+689" },
  { name: "French Southern and Antarctic Lands", cca2: "TF", idd: "+262" },
  { name: "Gabon", cca2: "GA", idd: "+241" },
  { name: "Gambia", cca2: "GM", idd: "+220" },
  { name: "Georgia", cca2: "GE", idd: "+995" },
  { name: "Germany", cca2: "DE", idd: "+49" },
  { name: "Ghana", cca2: "GH", idd: "+233" },
  { name: "Gibraltar", cca2: "GI", idd: "+350" },
  { name: "Greece", cca2: "GR", idd: "+30" },
  { name: "Greenland", cca2: "GL", idd: "+299" },
  { name: "Grenada", cca2: "GD", idd: "+1473" },
  { name: "Guadeloupe", cca2: "GP", idd: "+590" },
  { name: "Guam", cca2: "GU", idd: "+1671" },
  { name: "Guatemala", cca2: "GT", idd: "+502" },
  { name: "Guernsey", cca2: "GG", idd: "+44" },
  { name: "Guinea", cca2: "GN", idd: "+224" },
  { name: "Guinea-Bissau", cca2: "GW", idd: "+245" },
  { name: "Guyana", cca2: "GY", idd: "+592" },
  { name: "Haiti", cca2: "HT", idd: "+509" },
  { name: "Honduras", cca2: "HN", idd: "+504" },
  { name: "Hong Kong", cca2: "HK", idd: "+852" },
  { name: "Hungary", cca2: "HU", idd: "+36" },
  { name: "Iceland", cca2: "IS", idd: "+354" },
  { name: "India", cca2: "IN", idd: "+91" },
  { name: "Indonesia", cca2: "ID", idd: "+62" },
  { name: "Iran", cca2: "IR", idd: "+98" },
  { name: "Iraq", cca2: "IQ", idd: "+964" },
  { name: "Ireland", cca2: "IE", idd: "+353" },
  { name: "Isle of Man", cca2: "IM", idd: "+44" },
  { name: "Israel", cca2: "IL", idd: "+972" },
  { name: "Italy", cca2: "IT", idd: "+39" },
  { name: "Ivory Coast", cca2: "CI", idd: "+225" },
  { name: "Jamaica", cca2: "JM", idd: "+1876" },
  { name: "Japan", cca2: "JP", idd: "+81" },
  { name: "Jersey", cca2: "JE", idd: "+44" },
  { name: "Jordan", cca2: "JO", idd: "+962" },
  { name: "Kazakhstan", cca2: "KZ", idd: "+76" },
  { name: "Kenya", cca2: "KE", idd: "+254" },
  { name: "Kiribati", cca2: "KI", idd: "+686" },
  { name: "Kosovo", cca2: "XK", idd: "+383" },
  { name: "Kuwait", cca2: "KW", idd: "+965" },
  { name: "Kyrgyzstan", cca2: "KG", idd: "+996" },
  { name: "Laos", cca2: "LA", idd: "+856" },
  { name: "Latvia", cca2: "LV", idd: "+371" },
  { name: "Lebanon", cca2: "LB", idd: "+961" },
  { name: "Lesotho", cca2: "LS", idd: "+266" },
  { name: "Liberia", cca2: "LR", idd: "+231" },
  { name: "Libya", cca2: "LY", idd: "+218" },
  { name: "Liechtenstein", cca2: "LI", idd: "+423" },
  { name: "Lithuania", cca2: "LT", idd: "+370" },
  { name: "Luxembourg", cca2: "LU", idd: "+352" },
  { name: "Macau", cca2: "MO", idd: "+853" },
  { name: "Madagascar", cca2: "MG", idd: "+261" },
  { name: "Malawi", cca2: "MW", idd: "+265" },
  { name: "Malaysia", cca2: "MY", idd: "+60" },
  { name: "Maldives", cca2: "MV", idd: "+960" },
  { name: "Mali", cca2: "ML", idd: "+223" },
  { name: "Malta", cca2: "MT", idd: "+356" },
  { name: "Marshall Islands", cca2: "MH", idd: "+692" },
  { name: "Martinique", cca2: "MQ", idd: "+596" },
  { name: "Mauritania", cca2: "MR", idd: "+222" },
  { name: "Mauritius", cca2: "MU", idd: "+230" },
  { name: "Mayotte", cca2: "YT", idd: "+262" },
  { name: "Mexico", cca2: "MX", idd: "+52" },
  { name: "Micronesia", cca2: "FM", idd: "+691" },
  { name: "Moldova", cca2: "MD", idd: "+373" },
  { name: "Monaco", cca2: "MC", idd: "+377" },
  { name: "Mongolia", cca2: "MN", idd: "+976" },
  { name: "Montenegro", cca2: "ME", idd: "+382" },
  { name: "Montserrat", cca2: "MS", idd: "+1664" },
  { name: "Morocco", cca2: "MA", idd: "+212" },
  { name: "Mozambique", cca2: "MZ", idd: "+258" },
  { name: "Myanmar", cca2: "MM", idd: "+95" },
  { name: "Namibia", cca2: "NA", idd: "+264" },
  { name: "Nauru", cca2: "NR", idd: "+674" },
  { name: "Nepal", cca2: "NP", idd: "+977" },
  { name: "Netherlands", cca2: "NL", idd: "+31" },
  { name: "New Caledonia", cca2: "NC", idd: "+687" },
  { name: "New Zealand", cca2: "NZ", idd: "+64" },
  { name: "Nicaragua", cca2: "NI", idd: "+505" },
  { name: "Niger", cca2: "NE", idd: "+227" },
  { name: "Nigeria", cca2: "NG", idd: "+234" },
  { name: "Niue", cca2: "NU", idd: "+683" },
  { name: "Norfolk Island", cca2: "NF", idd: "+672" },
  { name: "North Korea", cca2: "KP", idd: "+850" },
  { name: "North Macedonia", cca2: "MK", idd: "+389" },
  { name: "Northern Mariana Islands", cca2: "MP", idd: "+1670" },
  { name: "Norway", cca2: "NO", idd: "+47" },
  { name: "Oman", cca2: "OM", idd: "+968" },
  { name: "Pakistan", cca2: "PK", idd: "+92" },
  { name: "Palau", cca2: "PW", idd: "+680" },
  { name: "Palestine", cca2: "PS", idd: "+970" },
  { name: "Panama", cca2: "PA", idd: "+507" },
  { name: "Papua New Guinea", cca2: "PG", idd: "+675" },
  { name: "Paraguay", cca2: "PY", idd: "+595" },
  { name: "Peru", cca2: "PE", idd: "+51" },
  { name: "Philippines", cca2: "PH", idd: "+63" },
  { name: "Pitcairn Islands", cca2: "PN", idd: "+64" },
  { name: "Poland", cca2: "PL", idd: "+48" },
  { name: "Portugal", cca2: "PT", idd: "+351" },
  { name: "Puerto Rico", cca2: "PR", idd: "+1787" },
  { name: "Qatar", cca2: "QA", idd: "+974" },
  { name: "Republic of the Congo", cca2: "CG", idd: "+242" },
  { name: "Romania", cca2: "RO", idd: "+40" },
  { name: "Russia", cca2: "RU", idd: "+73" },
  { name: "Rwanda", cca2: "RW", idd: "+250" },
  { name: "Réunion", cca2: "RE", idd: "+262" },
  { name: "Saint Barthélemy", cca2: "BL", idd: "+590" },
  {
    name: "Saint Helena, Ascension and Tristan da Cunha",
    cca2: "SH",
    idd: "+290",
  },
  { name: "Saint Kitts and Nevis", cca2: "KN", idd: "+1869" },
  { name: "Saint Lucia", cca2: "LC", idd: "+1758" },
  { name: "Saint Martin", cca2: "MF", idd: "+590" },
  { name: "Saint Pierre and Miquelon", cca2: "PM", idd: "+508" },
  { name: "Saint Vincent and the Grenadines", cca2: "VC", idd: "+1784" },
  { name: "Samoa", cca2: "WS", idd: "+685" },
  { name: "San Marino", cca2: "SM", idd: "+378" },
  { name: "Saudi Arabia", cca2: "SA", idd: "+966" },
  { name: "Senegal", cca2: "SN", idd: "+221" },
  { name: "Serbia", cca2: "RS", idd: "+381" },
  { name: "Seychelles", cca2: "SC", idd: "+248" },
  { name: "Sierra Leone", cca2: "SL", idd: "+232" },
  { name: "Singapore", cca2: "SG", idd: "+65" },
  { name: "Sint Maarten", cca2: "SX", idd: "+1721" },
  { name: "Slovakia", cca2: "SK", idd: "+421" },
  { name: "Slovenia", cca2: "SI", idd: "+386" },
  { name: "Solomon Islands", cca2: "SB", idd: "+677" },
  { name: "Somalia", cca2: "SO", idd: "+252" },
  { name: "South Africa", cca2: "ZA", idd: "+27" },
  { name: "South Georgia", cca2: "GS", idd: "+500" },
  { name: "South Korea", cca2: "KR", idd: "+82" },
  { name: "South Sudan", cca2: "SS", idd: "+211" },
  { name: "Spain", cca2: "ES", idd: "+34" },
  { name: "Sri Lanka", cca2: "LK", idd: "+94" },
  { name: "Sudan", cca2: "SD", idd: "+249" },
  { name: "Suriname", cca2: "SR", idd: "+597" },
  { name: "Svalbard and Jan Mayen", cca2: "SJ", idd: "+4779" },
  { name: "Sweden", cca2: "SE", idd: "+46" },
  { name: "Switzerland", cca2: "CH", idd: "+41" },
  { name: "Syria", cca2: "SY", idd: "+963" },
  { name: "São Tomé and Príncipe", cca2: "ST", idd: "+239" },
  { name: "Taiwan", cca2: "TW", idd: "+886" },
  { name: "Tajikistan", cca2: "TJ", idd: "+992" },
  { name: "Tanzania", cca2: "TZ", idd: "+255" },
  { name: "Thailand", cca2: "TH", idd: "+66" },
  { name: "Timor-Leste", cca2: "TL", idd: "+670" },
  { name: "Togo", cca2: "TG", idd: "+228" },
  { name: "Tokelau", cca2: "TK", idd: "+690" },
  { name: "Tonga", cca2: "TO", idd: "+676" },
  { name: "Trinidad and Tobago", cca2: "TT", idd: "+1868" },
  { name: "Tunisia", cca2: "TN", idd: "+216" },
  { name: "Turkey", cca2: "TR", idd: "+90" },
  { name: "Turkmenistan", cca2: "TM", idd: "+993" },
  { name: "Turks and Caicos Islands", cca2: "TC", idd: "+1649" },
  { name: "Tuvalu", cca2: "TV", idd: "+688" },
  { name: "Uganda", cca2: "UG", idd: "+256" },
  { name: "Ukraine", cca2: "UA", idd: "+380" },
  { name: "United Arab Emirates", cca2: "AE", idd: "+971" },
  { name: "United Kingdom", cca2: "GB", idd: "+44" },
  { name: "United States", cca2: "US", idd: "+1201" },
  { name: "United States Minor Outlying Islands", cca2: "UM", idd: "+268" },
  { name: "United States Virgin Islands", cca2: "VI", idd: "+1340" },
  { name: "Uruguay", cca2: "UY", idd: "+598" },
  { name: "Uzbekistan", cca2: "UZ", idd: "+998" },
  { name: "Vanuatu", cca2: "VU", idd: "+678" },
  { name: "Vatican City", cca2: "VA", idd: "+3906698" },
  { name: "Venezuela", cca2: "VE", idd: "+58" },
  { name: "Vietnam", cca2: "VN", idd: "+84" },
  { name: "Wallis and Futuna", cca2: "WF", idd: "+681" },
  { name: "Western Sahara", cca2: "EH", idd: "+2125288" },
  { name: "Yemen", cca2: "YE", idd: "+967" },
  { name: "Zambia", cca2: "ZM", idd: "+260" },
  { name: "Zimbabwe", cca2: "ZW", idd: "+263" },
  { name: "Åland Islands", cca2: "AX", idd: "+35818" },
];

interface Country {
  name: string;
  cca2: string;
  idd: string;
}

export async function populateNationalities() {
  const nationalitySelect = document.getElementById(
    "nationality"
  ) as HTMLSelectElement;

  countries
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .forEach((country: Country) => {
      const option = document.createElement("option");
      option.value = country.cca2.toLowerCase();
      option.textContent = country.name;
      nationalitySelect?.appendChild(option);
    });

  nationalitySelect.selectedIndex = 3;

  // logCountries();
}

export async function populatePhoneExtentions() {
  const phoneExtentionSelect = document.getElementById(
    "phone-extention"
  ) as HTMLSelectElement;

  countries
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .forEach((country: Country) => {
      const option = document.createElement("option");
      option.value = JSON.stringify({
        countryCode: country.cca2.toLowerCase(),
        prefix: country.idd,
      });
      option.textContent = `${country.cca2} (${country.idd})`;
      phoneExtentionSelect?.appendChild(option);
    });

  phoneExtentionSelect.selectedIndex = 3;
}

// async function logCountries() {
//   try {
//     const response = await fetch("https://restcountries.com/v3.1/all");
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const countries: Country[] = await response.json();

//     console.log(
//       countries
//         .filter((c) => c.idd && Object.keys(c.idd).length > 0)
//         .sort((a, b) => (a.name.common > b.name.common ? 1 : -1))
//         .map((c) => {
//           return c;
//           return {
//             name: c.name.common,
//             cca2: c.cca2,
//             idd: c.idd.root + c.idd.suffixes[0],
//           };
//         })
//     );
//   } catch (error) {
//     console.error("Failed to fetch countries:", error);
//   }
// }
