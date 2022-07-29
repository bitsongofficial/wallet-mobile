import { SupportedCoins } from "constants/Coins"
import { ClaimData } from "core/types/coin/cosmos/ClaimData"
import { DelegationsData } from "core/types/coin/cosmos/DelegationsData"
import { RewardsData } from "core/types/coin/cosmos/RewardsData"
import { Validator } from "core/types/coin/cosmos/Validator"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { fromAmountToCoin } from "core/utils/Coin"
import { autorun, makeAutoObservable } from "mobx"
import CoinStore from "./CoinStore"
import WalletStore from "./WalletStore"

type validatorIndexer = string | number | Validator

export default class ValidatorStore {
	validators: Validator[] = []
	rewards: {
		debtor: string,
		rewards: Amount[],
	}[] = []
	delegations: {
		validatorAddress: string,
		amount: Amount,
	}[] = []

	constructor(private coinStore: CoinStore, private walletStore: WalletStore) {
		makeAutoObservable(this, {}, { autoBind: true })

		autorun(() =>
		{
			this.load()
		})	
	}

	async load()
	{
		let validators: any = []
		let rewards: any = []
		let delegations: any = []
		const wallet = this.walletStore.activeWallet
		for(const chain of Object.values(SupportedCoins))
		{
			try
			{
				const coin = CoinClasses[chain]
				const val:Validator[] = await coin.Do(CoinOperationEnum.Validators)
				val.forEach(v => {
					v.chain = chain
				})
				validators = validators.concat(val)

				if(wallet)
				{
					const rewardsData: RewardsData = {
						wallet: wallet.wallets[chain],
					}
					rewards = rewards.concat(await coin.Do(CoinOperationEnum.Rewards, rewardsData))
					const delegationsData: DelegationsData = {
						delegator: wallet.wallets[chain],
					}
					delegations = rewards.concat(await coin.Do(CoinOperationEnum.Delegations, delegationsData))
				}
			}
			catch(e)
			{
				console.error("Catched", e)
			}
		}
		this.validators.splice(0, this.validators.length, ...validators)
		this.rewards.splice(0, this.rewards.length, ...rewards)
		this.delegations.splice(0, this.delegations.length, ...delegations)
	}

	get totalVotingPower()
	{
		return this.validators.reduce((current, next) => (current + next.tokens), 0)
	}

	resolveValidator(index: validatorIndexer)
	{
		if(typeof index == "string") return this.validators.find(v => v.id == index) ?? null
		if(typeof index == "number") return this.validators[index] ?? null
		return this.validators.find(v => v.id = index.id) ?? null
	}

	percentageVotingPower(validator: validatorIndexer)
	{
		const v = this.resolveValidator(validator)
		if(v) return v.tokens / this.totalVotingPower * 100
		return 0
	}

	totalStakeAsFIAT(validator: validatorIndexer)
	{
		const v = this.resolveValidator(validator)
		if(v) return this.coinStore.fromAmountToFIAT(
			{
				amount: v.tokens.toString(),
				denom: CoinClasses[v.chain ?? SupportedCoins.BITSONG].denom(),
			})
		return 0
	}

	validatorDelegations(validator: validatorIndexer)
	{
		const v = this.resolveValidator(validator)
		if(v)
		{
			const validatorDelegations = this.delegations.find(r => r.validatorAddress == v.operator)
			if(validatorDelegations)
			{
				const delegations = validatorDelegations.amount
				return fromAmountToCoin(delegations)
			}
		}

		return 0		
	}

	validatorReward(validator: validatorIndexer)
	{
		const v = this.resolveValidator(validator)
		if(v)
		{
			const validatorRewards = this.rewards.find(r => r.debtor == v.operator)
			if(validatorRewards)
			{
				const rewards = validatorRewards.rewards
				const total = rewards.reduce((tot, r) => (tot + fromAmountToCoin(r)), 0)
				return total
			}
		}

		return 0
	}

	get totalRewardAsDollars()
	{
		try
		{
			const rewards = this.rewards.reduce<Amount[]>((prev, current) => (prev.concat(current.rewards)), [])
			const total = rewards.reduce((tot, r) => (tot + this.coinStore.fromAmountToFIAT(r)), 0)
			return total
		}
		catch(e)
		{
			return 0
		}
	}

	get totalReward()
	{
		try
		{
			const rewards = this.rewards.reduce<Amount[]>((prev, current) => (prev.concat(current.rewards)), [])
			const total = rewards.reduce((tot, r) => (tot + fromAmountToCoin(r)), 0)
			return total
		}
		catch(e)
		{
			return 0
		}
	}

	async claim(validator: validatorIndexer)
	{
		const v = this.resolveValidator(validator)
		const wallet = this.walletStore.activeWallet
		if(v && wallet)
		{
			const chain = v.chain ?? SupportedCoins.BITSONG
			const coin = CoinClasses[chain]
			const claimData: ClaimData = {
				owner: wallet.wallets[chain],
				validators: [v]
			}
			const res = await coin.Do(CoinOperationEnum.Claim, claimData)
			this.load()
			return res
		}
		return false
	}

	async claimAll()
	{
		const validatorAddresses = this.rewards.map(r => r.debtor)
		const validators = validatorAddresses.map(va => this.validators.find(v => v.operator == va)) as Validator[]
		const wallet = this.walletStore.activeWallet
		if(validators.length > 0 && wallet)
		{
			const validatorPerChain: {
				chain: SupportedCoins,
				validators: Validator[],
			}[] = []
			validators.forEach(v => {
				let found = validatorPerChain.find(vpc => vpc.chain == v.chain)
				if(found == undefined)
				{
					found = {
						chain: v.chain ?? SupportedCoins.BITSONG,
						validators: [],
					}
					validatorPerChain.push(found)
				}
				if(found) found.validators.push(v)
			})
			const res = await Promise.allSettled(validatorPerChain.map(vpc =>
			{
				const coin = CoinClasses[vpc.chain]
				const claimData: ClaimData = {
					owner: wallet.wallets[vpc.chain],
					validators: vpc.validators
				}
				return coin.Do(CoinOperationEnum.Claim, claimData)
			}))
			this.load()
			return res
		}
		return false
	} 
}
