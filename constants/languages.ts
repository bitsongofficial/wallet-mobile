import { ILang } from "screens/Profile/type";

export enum Languages {
  En = "en",
  It = "it",
}

export const LanguageData: {
  [k in Languages]: ILang
} = {
  [Languages.It]: { name: "Italiano", value: "it" },
  [Languages.En]: { name: "English", value: "en" },
}
  // { name: "Mandarino", value: "en", id: "1" },
  // { name: "Hindi", value: "en", id: "2" },
  // { name: "Spagnolo", value: "en", id: "3" },
  // { name: "Arabo", value: "en", id: "4" },
  // { name: "Bengalese", value: "en", id: "5" },
  // { name: "Francese", value: "en", id: "6" },
  // { name: "Russo", value: "en", id: "7" },
  // { name: "Portoghese", value: "en", id: "8" },
  // { name: "Urdu", value: "en", id: "9" },
];

