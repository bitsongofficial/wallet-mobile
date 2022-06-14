import { Amount } from "../Generic";

export interface Reward {
	debtor: string,
	rewards: Amount[],
}