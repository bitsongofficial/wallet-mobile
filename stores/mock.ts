import { SupportedCoins } from "constants/Coins";
import { ICoin } from "../classes/types";

const btsg = {
  _id: "1",
  logo: require("assets/images/mock/logo_bitsong.png"),
  balance: 101001.34,
  brand: "BitSong",
  coinName: "BTSG",
  address: "bitsong19gwrv99dc99craqxzgf7tjh7hruk9h95y6adyp",
  coin: SupportedCoins.BITSONG
} as ICoin

export default {
  BitSong: btsg,
  btsg, 
  Juno: {
    _id: "2",
    logo: require("assets/images/mock/logo_osmosis.png"),
    balance: 501.34,
    brand: "Juno",
    coinName: "JUNO",
    address: "juno19gwrv99dc99craqxzgf7tjh7hruk9h95jg7kra",
    coin: SupportedCoins.BITSONG
  } as ICoin,

  Osmosis: {
    _id: "3",
    logo: require("assets/images/mock/logo_osmosis.png"),
    balance: 101001.34,
    brand: "Osmosis",
    coinName: "OSMO",
    address: "osmo19gwrv99dc99craqxzgf7tjh7hruk9h95vpwajn",
    coin: SupportedCoins.BITSONG
  } as ICoin,
};
