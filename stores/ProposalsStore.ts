import { SupportedCoins, SupportedCoinsMap } from "constants/Coins"
import { ClaimData } from "core/types/coin/cosmos/ClaimData"
import { DelegationsData } from "core/types/coin/cosmos/DelegationsData"
import { Proposal } from "core/types/coin/cosmos/Proposal"
import { RewardsData } from "core/types/coin/cosmos/RewardsData"
import { Validator } from "core/types/coin/cosmos/Validator"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { fromAmountToCoin } from "core/utils/Coin"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { autorun, makeAutoObservable, set } from "mobx"
import CoinStore from "./CoinStore"
import WalletStore from "./WalletStore"

type proposalIndexer = string | number | Proposal

export default class ProposalsStore {
	proposals: SupportedCoinsMap<Proposal[]> = {}

	constructor(private walletStore: WalletStore) {
		makeAutoObservable(this, {}, { autoBind: true })

		autorun(() =>
		{
			this.load()
		})	
	}

	async load()
	{
		const wallet = this.walletStore.activeWallet
		for(const chain of Object.values(SupportedCoins))
		{
			try
			{
				const coin = CoinClasses[chain]
				const prop:Proposal[] = await coin.Do(CoinOperationEnum.Proposals)
				prop.sort((p1, p2) =>
				{
					const s1 = p1.voting?.start?.getTime()
					const s2 = p2.voting?.start?.getTime()
					if(s1 && s2)
					{
						return s2-s1
					}
					return 0
				})
				prop.forEach(p => {
					p.chain = chain
				})
				set(this.proposals, {[chain]: prop})
			}
			catch(e)
			{
				console.error("Catched", e)
			}
		}
	}

	filterByCoinAndType(coin: SupportedCoins, status?: ProposalStatus) {
		const props = this.proposals[coin]
		if(props == undefined) return []
		if(status == undefined) return props
		if(props) return props.filter(p => p.status == status)
		return []
	}
}
