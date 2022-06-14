import { DirectSecp256k1HdWallet } from "@cosmjs-rn/proto-signing";
import { Derivator } from "../utils/derivator";

export type Mnemonic = string

export interface MnemonicToWallet extends Derivator {
	Derive(data: Mnemonic): Promise<DirectSecp256k1HdWallet>
}