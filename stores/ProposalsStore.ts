import { SupportedCoins } from "constants/Coins"
import { ClaimData } from "core/types/coin/cosmos/ClaimData"
import { DelegationsData } from "core/types/coin/cosmos/DelegationsData"
import { Proposal } from "core/types/coin/cosmos/Proposal"
import { RewardsData } from "core/types/coin/cosmos/RewardsData"
import { Validator } from "core/types/coin/cosmos/Validator"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { fromAmountToCoin } from "core/utils/Coin"
import { autorun, makeAutoObservable } from "mobx"
import CoinStore from "./CoinStore"
import WalletStore from "./WalletStore"

type proposalIndexer = string | number | Proposal

export default class ProposalsStore {
	proposals: Proposal[] = []

	constructor(private walletStore: WalletStore) {
		makeAutoObservable(this, {}, { autoBind: true })

		autorun(() =>
		{
			this.load()
		})	
	}

	async load()
	{
		let proposals: any = []
		const wallet = this.walletStore.activeWallet
		for(const chain of Object.values(SupportedCoins))
		{
			try
			{
				const coin = CoinClasses[chain]
				const prop:Proposal[] = await coin.Do(CoinOperationEnum.Proposals)
				prop.forEach(p => {
					p.chain = chain
				})
				proposals = proposals.concat(prop)
			}
			catch(e)
			{
				console.error("Catched", e)
			}
		}
		this.proposals.splice(0, this.proposals.length, ...proposals)
		// console.log(this.proposals)
	}
}
