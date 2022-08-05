import { ImageSourcePropType } from "react-native"
import { makeAutoObservable } from "mobx"
import { IPerson } from "./types_new"

export default class User {
	photo: string | null = "" // require("assets/images/mock/avatar_2.png");
	nick: string = ""

	constructor(public data: IPerson) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setNick(nick: string) {
		this.nick = nick
	}

	setPhoto(photo: string) {
		this.photo = photo
	}
}
