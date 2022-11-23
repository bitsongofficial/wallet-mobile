import { SupportedCoins, SupportedCoinsFullMap, SupportedCoinsMap } from "constants/Coins"
import { CosmosWallet } from "core/storing/Wallet"
import { DepositData } from "core/types/coin/cosmos/DepositData"
import { Proposal, ProposalType } from "core/types/coin/cosmos/Proposal"
import { ProposalVote } from "core/types/coin/cosmos/ProposalVote"
import { SubmitProposalData } from "core/types/coin/cosmos/SubmitProposalData"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { convertRateFromDenom, fromAmountToCoin } from "core/utils/Coin"
import { ProposalStatus, VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { get, makeAutoObservable, runInAction, set, values } from "mobx"
import moment from "moment"
import { has } from "utils/mobx"
import LocalStorageManager from "./LocalStorageManager"
import RemoteConfigsStore from "./RemoteConfigsStore"
import ValidatorStore from "./ValidatorStore"
import WalletStore from "./WalletStore"

const maxRecentChains = 5

type proposalIndexer = {coin: SupportedCoins, id: Long} | {coin: SupportedCoins, index: number} | Proposal

export default class ProposalsStore {
	localStorageManager?: LocalStorageManager
	proposals: SupportedCoinsMap<Proposal[]> = {}
	recentChains: SupportedCoins[] = []
	quorums: SupportedCoinsFullMap<number> = {
		[SupportedCoins.BITSONG]: 0,
		[SupportedCoins.BITSONG118]: 0,
		[SupportedCoins.OSMOSIS]: 0,
		[SupportedCoins.BITSONG_TESTNET]: 0,
		[SupportedCoins.BITSONG118_TESTNET]: 0,
		[SupportedCoins.OSMOSIS_TESTNET]: 0,
	}
	minDeposits: SupportedCoinsFullMap<Amount> = {
		[SupportedCoins.BITSONG]: {
			denom: Denom.UBTSG,
			amount: "0",
		},
		[SupportedCoins.BITSONG118]: {
			denom: Denom.UBTSG,
			amount: "0",
		},
		[SupportedCoins.OSMOSIS]: {
			denom: Denom.UOSMO,
			amount: "0",
		},
		[SupportedCoins.BITSONG_TESTNET]: {
			denom: Denom.UBTSG,
			amount: "0",
		},
		[SupportedCoins.BITSONG118_TESTNET]: {
			denom: Denom.UBTSG,
			amount: "0",
		},
		[SupportedCoins.OSMOSIS_TESTNET]: {
			denom: Denom.UOSMO,
			amount: "0",
		},
	}
	proposalDraft?: {
		chain: SupportedCoins,
		title: string,
		description: string,
		deposit: number,
	}

	constructor(private remoteConfigStore: RemoteConfigsStore, private walletStore: WalletStore, private validatorsStore: ValidatorStore) {
		makeAutoObservable(this, {}, { autoBind: true })

		this.load()
	}

	async load()
	{
		for(const chain of this.remoteConfigStore.enabledCoins)
		{
			try
			{
				const coin = CoinClasses[chain]
				const explorer = coin.explorer()
				explorer.get("/cosmos/gov/v1beta1/params/tallying").then(data =>
					{
						runInAction(() =>
						{
							this.quorums[chain] = parseFloat(data.data.tally_params.quorum) * 100
						})
					})

				explorer.get("/cosmos/gov/v1beta1/params/deposit").then(data =>
				{
					runInAction(() =>
					{
						this.minDeposits[chain] = data.data.deposit_params.min_deposit[0] as Amount
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

	update()
	{
		return new Promise<void>((accept, reject) =>
		{
			runInAction(async () =>
			{
				try {
					await this.load()
				}
				catch
				{
					reject()
				}
				accept()
			})
		})
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
		if(has(index, 'index') && has(index, 'coin'))
		{
			const proposals = get(this.proposals, (index as any).coin) as Proposal[]
			if(proposals) return proposals[(index as any).index]
		}
		if(has(index, 'id') && has(index, 'coin'))
		{
			const proposals = get(this.proposals, (index as any).coin) as Proposal[]
			if(proposals) return proposals.find(p => p.id.equals((index as any).id))
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

	voted(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p &&	p.result)
		{
			return (p.result.yes + p.result.noWithZero + p.result.no + p.result.abstain)
		}
		return 0
	}

	votedPercentage(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p &&	p.result)
		{
			const coin = p.chain ?? SupportedCoins.BITSONG
			const votingPower = this.validatorsStore.totalVotingPower[coin]
			const voted = this.voted(p)
			return voted / votingPower * 100
		}
		return 0
	}

	percentages(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p &&	p.result)
		{
			const votingPower = values(p.result).reduce((tot, c) => tot + c, 0)
			const percentageRatio = (votingPower ? votingPower : 100) / 100
			return {
				yes: p.result.yes / percentageRatio,
				no: p.result.no / percentageRatio,
				noWithZero: p.result.noWithZero / percentageRatio,
				abstain: p.result.abstain / percentageRatio,
				total: votingPower,
			}
		}
		return 0
	}

	quorum(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p && p.chain) return this.quorums[p.chain]
		return this.quorums[SupportedCoins.BITSONG]
	}

	quorumPercentage(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p)
		{
			const voted = this.votedPercentage(p)
			return voted / this.quorums[p.chain ?? SupportedCoins.BITSONG] * 100
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
			const res = await chain.Do(CoinOperationEnum.Vote, data)
			this.update()
			return res
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
		const res = await coin.Do(CoinOperationEnum.SubmitProposal, data)
		this.proposalDraft = undefined
		this.update()
		return res
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
			const res = await chain.Do(CoinOperationEnum.Deposit, data)
			this.update()
			return res
		}
	}

	steps(proposal: proposalIndexer)
	{
		const steps = [
			{
				completed: false,
				title: "Created",
				date: moment().subtract(1, "month").toString(),
			},
			{
				completed: false,
				title: "Deposit Period Ends",
				date: moment().subtract(1, "month").toString(),
			},
			{
				completed: false,
				title: "Voting Period Starts",
				date: moment().subtract(1, "month").toString(),
			},
			{
				completed: false,
				title: "Voting Period Ends",
				date: moment().subtract(1, "month").toString(),
			},
		]
		const p = this.resolveProposal(proposal)
		if(p)
		{
			const [ created, deposit, votingStart, votingEnd] = steps
			created.completed = true
			created.date = moment(p.submit).fromNow()
			deposit.date = moment.min(moment(p.deposit), moment(p.voting?.start)).fromNow()
			votingStart.date = moment(p.voting?.start).fromNow()
			votingEnd.date = moment(p.voting?.end).fromNow()
			if(p.status == ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED || p.status == ProposalStatus.UNRECOGNIZED) return steps
			if(p.status != ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD)
			{
				deposit.completed = true
				votingStart.completed = true
				if(p.status != ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD)
				{
					votingEnd.completed = true
				}
			}
		}
		return steps
	}

	minDeposit(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		let deposit
		if(p && p.chain) deposit = this.minDeposits[p.chain]
		else deposit = this.minDeposits[SupportedCoins.BITSONG]
		return fromAmountToCoin(deposit)
	}

	proposalTypeDescrition(proposal: proposalIndexer)
	{
		const p = this.resolveProposal(proposal)
		if(p && p.type)
		{
			switch(p.type)
			{
				case ProposalType.TEXT:
				case ProposalType.SOFTWARE_UPGRADE:
				case ProposalType.PARAMETER_CHANGE:
				case ProposalType.TREASURY:
					return "This is a text proposal. Text proposals can be proposed by anyone and are used as a signalling mechanism for this community. If this proposal is accepted, nothing will change without community coordination."
			}
		}

		return "This proposal type is not supported"
	}

	saveProposalDraft(chain: SupportedCoins, title: string, description: string, initialDeposit = 0)
	{
		this.proposalDraft = {
			chain,
			title,
			description,
			deposit: initialDeposit,
		}
		this.localStorageManager?.saveProposals()
	}

	addToRecent(chain : SupportedCoins)
	{
		runInAction(() =>
		{
			const i = this.recentChains.indexOf(chain)
			if(i > -1)
			{
				this.recentChains.splice(i, 1)
			}
			this.recentChains.unshift(chain)
			if(this.recentChains.length > maxRecentChains) this.recentChains.pop()
		})
	}
}
