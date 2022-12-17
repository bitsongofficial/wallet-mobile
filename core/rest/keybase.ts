import axios from "axios";
import { KeybaseResponse, KeybaseUser } from "core/types/rest/keybase";
import Config from "react-native-config";

export const keybaseAPI = axios.create({
	withCredentials: false,
	headers: {
		'Content-Type': 'application/json',
	},
	responseType: 'json',
	baseURL: Config.KEYBASE_URL ? (Config.KEYBASE_URL + (Config.KEYBASE_URL[Config.KEYBASE_URL.length-1] == "/" ? "" : "/") + "_/api/1.0/") : ""
})
export async function validatorsIdentities(identities: string[])
{
	if(identities)
	{
		const valIdentity = (await keybaseAPI.get<KeybaseResponse>("user/lookup.json", {
			params: {
				usernames: identities.join(","),
				fields: "profile",
			}
		})).data
		if(valIdentity.list && valIdentity.list[0]) return valIdentity.list[0].keybase
	}
	const empty: KeybaseUser = {
		full_name: "",
		is_followee: false,
		picture_url: "",
		raw_score: 0,
		stellar: null,
		uid: "",
		username: ""
	}

	return [empty]
}

export async function validatorsPictures(identities: string[])
{
	if(identities && identities.length > 0)
	{
		const pictures = (await keybaseAPI.get<KeybaseResponse>("user/lookup.json", {
			params: {
				usernames: identities.join(","),
				fields: "pictures",
			}
		})).data
		if(pictures.status.code == 100) console.log(identities.join(","), pictures)
		if(pictures.them) return pictures.them.map(p => (p && p.pictures) ? p.pictures.primary.url : undefined)
	}

	return []
}