import { Wallet } from "core/types/storing/Generic";
import { DelegateData } from "./DelegateData";

export interface RedelegateData extends DelegateData {
	newValidator: Wallet,
}