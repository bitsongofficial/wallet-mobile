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
export async function validatorIdentity(identity: string)
{
	if(identity)
	{
		const valIdentity = (await keybaseAPI.get<KeybaseResponse>("user/user_search.json", {
			params: {
				q: identity,
				num_wanted: 1,
			}
		})).data
		if(valIdentity.list[0]) return valIdentity.list[0].keybase
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

	return empty
}