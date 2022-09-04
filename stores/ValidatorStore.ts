import { SupportedCoins, SupportedCoinsFullMap, SupportedCoinsMap } from "constants/Coins"
import { ClaimData } from "core/types/coin/cosmos/ClaimData"
import { DelegateData } from "core/types/coin/cosmos/DelegateData"
import { DelegationsData } from "core/types/coin/cosmos/DelegationsData"
import { RedelegateData } from "core/types/coin/cosmos/RedelegateData"
import { RewardsData } from "core/types/coin/cosmos/RewardsData"
import { Validator, ValidatorStatus } from "core/types/coin/cosmos/Validator"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { WalletTypes } from "core/types/storing/Generic"
import { convertRateFromDenom, fromAmountToCoin } from "core/utils/Coin"
import { autorun, has, makeAutoObservable, runInAction, set, toJS } from "mobx"
import CoinStore from "./CoinStore"
import WalletStore from "./WalletStore"

type validatorIndexer = string | number | Validator | { operator: string } | { id: string }

export default class ValidatorStore {
	validators: Validator[] = []
	rewards: {
		debtor: string
		rewards: Amount[]
	}[] = []
	delegations: {
		validatorAddress: string
		amount: Amount
	}[] = []

	totalVotingPower: SupportedCoinsFullMap<number> = {
		[SupportedCoins.BITSONG]: 0,
	}

	private aprRatio: SupportedCoinsMap = {}

	constructor(private coinStore: CoinStore, private walletStore: WalletStore) {
		makeAutoObservable(
			this,
			{
				totalVotingPower: false,
				percentageVotingPower: false,
			},
			{ autoBind: true },
		)
		autorun(() =>
		{
			this.loadValidators()
		})
		autorun(() =>
		{
			this.loadRewardsAndDelegations()
		})
	}

	private async loadValidators()
	{
		let validators: Validator[] = []
		for(const chain of Object.values(SupportedCoins))
		{
			this.totalVotingPower[chain] = 0
			try {
				const coin = CoinClasses[chain]
				const service = coin.explorer()
				Promise.all([
					service.get("cosmos/mint/v1beta1/annual_provisions"),
					service.get("cosmos/staking/v1beta1/pool"),
				])
					.then((resRaw) => {
						const res = resRaw.map((r) => r.data)
						set(this.aprRatio, { [chain]: res[0].annual_provisions / res[1].pool.bonded_tokens })
					})
					.catch((e) => {
						console.error("Catched", e)
					})
				let val: Validator[] = await coin.Do(CoinOperationEnum.Validators)
				val = val.filter((v) => v.status.status != ValidatorStatus.INACTIVE)
				val.forEach((v) => {
					v.chain = chain
					this.totalVotingPower[chain] += v.tokens
				})
				validators = validators.concat(val)
			}
			catch(e)
			{
				console.error("Catched", e)
			}
		}
		validators = validators.sort((v1, v2) => (v2.tokens - v1.tokens))
		runInAction(() =>
		{
			this.validators.splice(0, this.validators.length, ...validators)
		})
	}

	private async loadRewardsAndDelegations()
	{
		let rewards: any[] = []
		let delegations: any[] = []
		const wallet = this.walletStore.activeWallet
		if(wallet == null) return
		for(const chain of Object.values(SupportedCoins))
		{
			try
			{
				const coin = CoinClasses[chain]

				if (wallet) {
					const rewardsData: RewardsData = {
						wallet: wallet.wallets[chain],
					}
					rewards = rewards.concat(await coin.Do(CoinOperationEnum.Rewards, rewardsData))
					const delegationsData: DelegationsData = {
						delegator: wallet.wallets[chain],
					}
					delegations = rewards.concat(
						await coin.Do(CoinOperationEnum.Delegations, delegationsData),
					)
				}
			} catch (e) {
				console.error("Catched", e)
			}
		}
		runInAction(() =>
		{
			this.rewards.splice(0, this.rewards.length, ...rewards)
			this.delegations.splice(0, this.delegations.length, ...delegations)
		})
	}

	private async load()
	{
		await this.loadValidators()
		this.loadRewardsAndDelegations()
	}

	update()
	{
		return new Promise<void>((accept, reject) =>
		{
			runInAction(async () =>
			{
				try {
					await this.load()
				} catch {
					reject()
				}
				accept()
			})
		})
	}

	get validatorsIds() {
		return this.validators.map((v) => v.id)
	}

	get CanStake()
	{
		return this.walletStore.activeProfile?.type != WalletTypes.WATCH
	}

	resolveValidator(index: validatorIndexer): Validator | null
	{
		if(typeof index == "number") return this.validators[index] ?? null
		const i = this.validators.indexOf(index as any)
		if (i > -1) return index as Validator
		if (typeof index == "string") return this.validators.find((v) => v.id == index) ?? null
		if (has(index, "id")) return this.validators.find((v) => v.id == (index as Validator).id) ?? null
		if (has(index, "operator"))
			return this.validators.find((v) => v.operator == (index as Validator).operator) ?? null
		return null
	}

	percentageVotingPower(validator: validatorIndexer) {
		const v = this.resolveValidator(validator)
		if (v) return (v.tokens / this.totalVotingPower[v.chain ?? SupportedCoins.BITSONG]) * 100
		return 0
	}

	apr(validator: validatorIndexer) {
		const v = this.resolveValidator(validator)
		if (v && v.chain) return (1 - v.commission.rate.current) * this.aprRatio[v.chain] * 100
		return 0
	}

	totalStakeAsFIAT(validator: validatorIndexer) {
		const v = this.resolveValidator(validator)
		if (v)
			return this.coinStore.fromAmountToFIAT({
				amount: v.tokens.toString(),
				denom: CoinClasses[v.chain ?? SupportedCoins.BITSONG].denom(),
			})
		return 0
	}

	validatorDelegations(validator: validatorIndexer) {
		const v = this.resolveValidator(validator)
		if (v) {
			const validatorDelegations = this.delegations.find((r) => r.validatorAddress == v.operator)
			if (validatorDelegations) {
				const delegations = validatorDelegations.amount
				return fromAmountToCoin(delegations)
			}
		}

		return 0
	}

	validatorReward(validator: validatorIndexer) {
		const v = this.resolveValidator(validator)
		if (v) {
			const validatorRewards = this.rewards.find((r) => r.debtor == v.operator)
			if (validatorRewards) {
				const rewards = validatorRewards.rewards
				const total = rewards.reduce((tot, r) => tot + fromAmountToCoin(r), 0)
				return total
			}
		}

		return 0
	}

	get totalRewardAsDollars() {
		try {
			const rewards = this.rewards.reduce<Amount[]>(
				(prev, current) => prev.concat(current.rewards),
				[],
			)
			const total = rewards.reduce((tot, r) => tot + this.coinStore.fromAmountToFIAT(r), 0)
			return total
		} catch (e) {
			return 0
		}
	}

	get totalReward() {
		try {
			const rewards = this.rewards.reduce<Amount[]>(
				(prev, current) => prev.concat(current.rewards),
				[],
			)
			const total = rewards.reduce((tot, r) => tot + fromAmountToCoin(r), 0)
			return total
		} catch (e) {
			return 0
		}
	}

	async claim(validator: validatorIndexer) {
		const v = this.resolveValidator(validator)
		const wallet = this.walletStore.activeWallet
		if (v && wallet) {
			const chain = v.chain ?? SupportedCoins.BITSONG
			const coin = CoinClasses[chain]
			const claimData: ClaimData = {
				owner: wallet.wallets[chain],
				validators: [v],
			}
			const res = await coin.Do(CoinOperationEnum.Claim, claimData)
			this.load()
			return res
		}
		return false
	}

	async claimAll() {
		const validatorAddresses = this.rewards.map((r) => r.debtor)
		const validators = validatorAddresses.map((va) =>
			this.validators.find((v) => v.operator == va),
		) as Validator[]
		const wallet = this.walletStore.activeWallet
		if (validators.length > 0 && wallet) {
			const validatorPerChain: {
				chain: SupportedCoins
				validators: Validator[]
			}[] = []
			validators.forEach((v) => {
				let found = validatorPerChain.find((vpc) => vpc.chain == v.chain)
				if (found == undefined) {
					found = {
						chain: v.chain ?? SupportedCoins.BITSONG,
						validators: [],
					}
					validatorPerChain.push(found)
				}
				if (found) found.validators.push(v)
			})
			const res = await Promise.allSettled(
				validatorPerChain.map((vpc) => {
					const coin = CoinClasses[vpc.chain]
					const claimData: ClaimData = {
						owner: wallet.wallets[vpc.chain],
						validators: vpc.validators,
					}
					return coin.Do(CoinOperationEnum.Claim, claimData)
				}),
			)
			this.load()
			return res
		}
		return false
	}

	async delegate(validator: Validator, amount: number) {
		const activeWallet = this.walletStore.activeWallet
		if (activeWallet && validator) {
			const chain = validator.chain ?? SupportedCoins.BITSONG
			const coin = CoinClasses[chain]
			const delegateData: DelegateData = {
				delegator: activeWallet.wallets[chain],
				validator,
				amount: {
					amount: (amount * convertRateFromDenom(coin.denom())).toString(),
					denom: coin.denom(),
				},
			}
			const res = await coin.Do(CoinOperationEnum.Delegate, delegateData)
			this.refreshData()
			return res
		}

		return false
	}

	async redelegate(validator: Validator, newValidator: Validator, amount: number) {
		const activeWallet = this.walletStore.activeWallet
		if (activeWallet && validator && newValidator) {
			const chain = validator.chain ?? SupportedCoins.BITSONG
			const coin = CoinClasses[chain]
			const delegateData: RedelegateData = {
				delegator: activeWallet.wallets[chain],
				validator,
				newValidator,
				amount: {
					amount: (amount * convertRateFromDenom(coin.denom())).toString(),
					denom: coin.denom(),
				},
			}
			const res = await await coin.Do(CoinOperationEnum.Redelegate, delegateData)
			if (res) this.refreshData()
			return res
		}
		return false
	}

	async undelegate(validator: Validator, amount: number) {
		const activeWallet = this.walletStore.activeWallet
		if (activeWallet && validator) {
			const chain = validator.chain ?? SupportedCoins.BITSONG
			const coin = CoinClasses[chain]
			const delegateData: DelegateData = {
				delegator: activeWallet.wallets[chain],
				validator,
				amount: {
					amount: (amount * convertRateFromDenom(coin.denom())).toString(),
					denom: coin.denom(),
				},
			}
			const res = await coin.Do(CoinOperationEnum.Undelegate, delegateData)
			if (res) this.refreshData()
			return res
		}
		return false
	}

	async refreshData() {
		runInAction(() =>
		{
			this.load()
			this.coinStore.updateBalances()
		})
	}
}
