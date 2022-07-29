import axios from "axios";
import { KeybaseResponse } from "core/types/rest/keybase";
import Config from "react-native-config";

export const keybaseAPI = axios.create({
	withCredentials: false,
	headers: {
		'Content-Type': 'application/json',
	},
	responseType: 'json',
	baseURL: Config.COINGGECKO_URL + (Config.COINGGECKO_URL[Config.COINGGECKO_URL.length-1] == "/" ? "" : "/") + "_/api/1.0/"
})
export async function validatorIdentity(identity: string)
{
	const valIdentity = (await keybaseAPI.get<KeybaseResponse>("user/user_search.json", {
		params: {
			q: identity,
			num_wanted: 1,
		}
	})).data
	return valIdentity.list[0].keybase
}