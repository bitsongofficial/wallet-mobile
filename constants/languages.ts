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
