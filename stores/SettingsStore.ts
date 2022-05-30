export default class SettingsStore {
  theme: "light" | "dark" = "dark";

  constructor() {}

  setTheme(theme: "light" | "dark") {
    this.theme = theme;
  }
}
