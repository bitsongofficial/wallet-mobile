import { SupportedCoins } from "constants/Coins"
import { ICoin } from "./types_new"

const btsg = {
	_id: "1",
	denom: "1",

	logo: require("assets/images/mock/logo_bitsong.png"),
	balance: 101001.34,
	brand: "BitSong",
	coinName: "BTSG",
	address: "bitsong19gwrv99dc99craqxzgf7tjh7hruk9h95y6adyp",
	coin: SupportedCoins.BITSONG,
} as ICoin

const btsg118 = {
	_id: "1",
	denom: "1",

	logo: require("assets/images/mock/logo_bitsong.png"),
	balance: 101001.34,
	brand: "BitSong",
	coinName: "BTSG",
	address: "bitsong19gwrv99dc99craqxzgf7tjh7hruk9h95y6adyp",
	coin: SupportedCoins.BITSONG118,
} as ICoin

const osmo = {
	_id: "1",
	denom: "1",

	logo: require("assets/images/mock/logo_bitsong.png"),
	balance: 101001.34,
	brand: "Osmosis",
	coinName: "OSMO",
	address: "bitsong19gwrv99dc99craqxzgf7tjh7hruk9h95y6adyp",
	coin: SupportedCoins.OSMOSIS,
} as ICoin

export default {
	BitSong: btsg,
	btsg,
	btsg118,
	osmo,
}
