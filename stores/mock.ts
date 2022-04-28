import { ICoin } from "../classes/types";

export default {
  BitSong: {
    _id: "1",

    logo: require("assets/images/mock/logo_bitsong.png"),
    balance: "101,001.34",
    reward: "107.89",
    brand: "BitSong",
    coinName: "BTSG",
  } as ICoin,

  Juno: {
    _id: "2",

    logo: require("assets/images/mock/logo_osmosis.png"),
    balance: "501.34",
    reward: "107.89",
    brand: "Juno",
    coinName: "JUNO",
  } as ICoin,

  Osmosis: {
    _id: "3",

    logo: require("assets/images/mock/logo_osmosis.png"),
    balance: "101,001.34",
    reward: "107.89",
    brand: "Osmosis",
    coinName: "OSMO",
  } as ICoin,
};
