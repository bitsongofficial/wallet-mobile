import { SupportedCoins, SupportedCoinsFullMap, SupportedCoinsMap } from "constants/Coins"
import { CosmosWallet } from "core/storing/Wallet"
import { DepositData } from "core/types/coin/cosmos/DepositData"
import { Proposal } from "core/types/coin/cosmos/Proposal"
import { ProposalVote } from "core/types/coin/cosmos/ProposalVote"
import { SubmitProposalData } from "core/types/coin/cosmos/SubmitProposalData"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { convertRateFromDenom } from "core/utils/Coin"
import { ProposalStatus, VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { autorun, get, makeAutoObservable, ObservableMap, runInAction, set, toJS, values } from "mobx"
import ValidatorStore from "./ValidatorStore"
import WalletStore from "./WalletStore"

type proposalIndexer = {coin: SupportedCoins, id: Long} | {coin: SupportedCoins, index: number} | Proposal

export default class ProposalsStore {
	proposals: SupportedCoinsMap<Proposal[]> = {}
	quorum: SupportedCoinsFullMap<number> = {
		[SupportedCoins.BITSONG]: 0,
	}

	constructor(private walletStore: WalletStore, private validatorsStore: ValidatorStore) {
		makeAutoObservable(this, {}, { autoBind: true })

		autorun(() =>
		{
			this.load()
		})	
	}

	async load()
	{
		for(const chain of Object.values(SupportedCoins))
		{
			try
			{
				const coin = CoinClasses[chain]
				coin.explorer().get("/cosmos/gov/v1beta1/params/tallying").then(data =>
					{
						runInAction(() =>
						{
							this.quorum[chain] = parseFloat(data.data.tally_params.quorum) * 100
						})
					})
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

	get allProposals()
	{
		let proposals: Proposal[] = []
		for(const prop of values(this.proposals))
		{
			if(prop) proposals = proposals.concat(prop)
		}

		return proposals
	}

	resolveProposal(index: proposalIndexer)
	{
		const i = this.allProposals.indexOf(index as any)
		if(i > -1) return index as Proposal
		if('index' in index && 'coin' in index)
		{
			const proposals = get(this.proposals, index.coin) as Proposal[]
			if(proposals) return proposals[index.index]
		}
		if('id' in index && 'coin' in index)
		{
			const proposals = get(this.proposals, index.coin) as Proposal[]
			if(proposals) return proposals.find(p => p.id == index.id)
		}
		return null
	}

	filterByCoinAndType(coin: SupportedCoins, status?: ProposalStatus) {
		const props = this.proposals[coin]
		if(props == undefined) return []
		if(status == undefined) return props
		if(props) return props.filter(p => p.status == status)
		return []
	}

	votedPercentage(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p &&	p.result)
		{
			const coin = p.chain ?? SupportedCoins.BITSONG
			const votingPower = this.validatorsStore.totalVotingPower[coin] / convertRateFromDenom(CoinClasses[coin].denom())
			return (p.result.yes + p.result.noWithZero + p.result.no + p.result.abstain) / votingPower * 100
		}
		return 0
	}

	percentages(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p &&	p.result)
		{
			const coin = p.chain ?? SupportedCoins.BITSONG
			const votingPower = this.validatorsStore.totalVotingPower[coin] / convertRateFromDenom(CoinClasses[coin].denom())
			const percentageRatio = votingPower * 100
			return {
				yes: p.result.yes / percentageRatio,
				no: p.result.no / percentageRatio,
				noWithZero: p.result.noWithZero / percentageRatio,
				abstain: p.result.abstain / percentageRatio,
			}
		}
		return 0
	}

	quorumPercentage(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p)
		{
			const voted = this.votedPercentage(p)
			return voted / this.quorum[p.chain ?? SupportedCoins.BITSONG] * 100
		}

		return 0
	}

	async vote(proposal: proposalIndexer, option: VoteOption)
	{
		const p = this.resolveProposal(proposal)
		if(p)
		{
			const coin = p.chain ?? SupportedCoins.BITSONG
			const wallet = this.walletStore.activeWallet?.wallets[coin] as CosmosWallet
			const chain = CoinClasses[coin]
			const data: ProposalVote = {
				voter: wallet,
				proposal: p,
				choice: option,
			}
			return await chain.Do(CoinOperationEnum.Vote, data)
		}

		return false
	}

	async submit(chain: SupportedCoins, title: string, description: string, initialDeposit = 0)
	{
		const coin = CoinClasses[chain]
		const denom = coin.denom()
		const wallet = this.walletStore.activeWallet?.wallets[chain] as CosmosWallet
		const data: SubmitProposalData = {
			proposer: wallet,
			proposal: {
				title,
				description,
			},
			initialDeposit: {
				amount: (initialDeposit * convertRateFromDenom(denom)).toString(),
				denom,
			},
		}
		return await coin.Do(CoinOperationEnum.SubmitProposal, data)
	}

	async deposit(proposal: proposalIndexer, deposit: number)
	{
		const p = this.resolveProposal(proposal)
		if(p)
		{
			const coin = p.chain ?? SupportedCoins.BITSONG
			const wallet = this.walletStore.activeWallet?.wallets[coin] as CosmosWallet
			const chain = CoinClasses[coin]
			const denom = chain.denom()
			const data: DepositData = {
				depositor: wallet,
				proposal: p,
				amount: {
					amount: (deposit * convertRateFromDenom(denom)).toString(),
					denom,
				}
			}
			return await chain.Do(CoinOperationEnum.Deposit, data)
		}
	}
}
