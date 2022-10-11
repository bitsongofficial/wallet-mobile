import { SupportedFiats } from "core/utils/Coin";
import { ICurrency } from "screens/Profile/type";

export {SupportedFiats as Currencies}

export const CurrenciesData: {
  [k in SupportedFiats]: ICurrency
} = {
  [SupportedFiats.USD]: {title: "Dollaro statunitense", symbol: "$" },
  [SupportedFiats.EUR]: {title: "Euro", symbol: "€"}
}
