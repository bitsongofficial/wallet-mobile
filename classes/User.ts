import { ImageSourcePropType } from "react-native";
import { makeAutoObservable } from "mobx";

export default class User {
  photo: string | null = ""; // require("assets/images/mock/avatar_2.png");
  nick: string = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setNick(nick: string) {
    this.nick = nick;
  }

  setPhoto(photo: string) {
    console.log("photo", photo);
    this.photo = photo;
  }
}
