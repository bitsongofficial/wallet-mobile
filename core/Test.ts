import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import Long from "long"
import { Bitsong } from "./coin/bitsong/Bitsong"
import { WalletConnectCosmosClient } from "./connection/WalletConnect"
import { WalletConnectCosmosClientV1 } from "./connection/WalletConnectV1"
import { PublicWallet } from "./storing/Generic"
import { PinMnemonicStore } from "./storing/MnemonicStore"
import { CosmosWallet, CosmosWalletGenerator } from "./storing/Wallet"
import { ClaimData } from "./types/coin/cosmos/ClaimData"
import { DelegateData } from "./types/coin/cosmos/DelegateData"
import { ProposalVote } from "./types/coin/cosmos/ProposalVote"
import { RedelegateData } from "./types/coin/cosmos/RedelegateData"
import { Denom } from "./types/coin/Generic"
import { CoinOperationEnum } from "./types/coin/OperationTypes"
import { Wallet } from "./types/storing/Generic"

const amount = {
	denom: Denom.UBTSG,
	amount: "100",
}

async function trySend(wallet: any, pubWallet: any, transaction: any)
{
	try
	{
		let senderBalance = await Bitsong.Do(CoinOperationEnum.Balance, {wallet: wallet})
		let receiverBalance = await Bitsong.Do(CoinOperationEnum.Balance, {wallet: pubWallet})
		console.log("S:", senderBalance)
		console.log("R:", receiverBalance)
		await Bitsong.Do(CoinOperationEnum.Send, transaction)
		senderBalance = await Bitsong.Do(CoinOperationEnum.Balance, {wallet: wallet})
		receiverBalance = await Bitsong.Do(CoinOperationEnum.Balance, {wallet: pubWallet})
		console.log("S:", senderBalance)
		console.log("R:", receiverBalance)
		// const pairString = 'wc:8caefe47-7adf-4bbc-a819-38441d1309ed@1?bridge=https%3A%2F%2Fy.bridge.walletconnect.org&key=6d8c314ab81d5f70c4365c3781e8c190d0844853dc5508210f6cf6a3ba78e144'
		// const wc = new WalletConnectCosmosClientV1(pairString, [pubWallet])
	}
	catch(e)
	{
		console.log("TE:", e)
	}

}

async function tryDelegate(delegator: CosmosWallet, validator: Wallet) {
	const data: DelegateData = {
		delegator: delegator,
		validator: validator,
		amount,
	}
	Bitsong.Do(CoinOperationEnum.Delegate, data)
}

async function tryUndelegate(delegator: CosmosWallet, validator: Wallet) {
	const data: DelegateData = {
		delegator: delegator,
		validator: validator,
		amount,
	}
	Bitsong.Do(CoinOperationEnum.Undelegate, data)
}

async function tryRedelegate(delegator: CosmosWallet, validator1: Wallet, validator2: Wallet) {
	const data: RedelegateData = {
		delegator: delegator,
		validator: validator1,
		newValidator: validator2,
		amount,
	}
	Bitsong.Do(CoinOperationEnum.Redelegate, data)
}

async function tryVote(voter: CosmosWallet, proposalId: Long, choice: VoteOption) {
	const data: ProposalVote = {
		voter,
		proposal: {
			id: proposalId
		},
		choice
	}
	Bitsong.Do(CoinOperationEnum.Vote, data)
}

async function tryClaim(owner: CosmosWallet, validators: Wallet[]) {
	const data: ClaimData = {
		owner,
		validators
	}
	Bitsong.Do(CoinOperationEnum.Claim, data)
}

async function tryValidators() {
	Bitsong.Do(CoinOperationEnum.Validators)
}

async function tryProposals() {
	Bitsong.Do(CoinOperationEnum.Proposals)
}

async function tryRewards(wallet: Wallet) {
	Bitsong.Do(CoinOperationEnum.Rewards, {wallet})
}

export async function test()
{
	const savePhase = false
	const [wallet, store] = CosmosWalletGenerator.BitsongWallet
	if(savePhase)
	{
		const a = 'man hungry enjoy price timber girl omit type absent target enrich butter'
		store.Set(a)
	}
	else
	{
		const pubWallet = new PublicWallet("bitsong1s0aj6f7hgzr3gfcmm9xz0lg0442qdq9su9llq0")
		const validator1 = new PublicWallet("bitsongvaloper16h2ry9axyvzwkftv93h6nusdqeqdn552skxxtw")
		const validator2 = new PublicWallet("bitsongvaloper16h2ry9axyvzwkftv93h6nusdqeqdn552skxxtw")
		const reward1 = new PublicWallet("bitsong1s0aj6f7hgzr3gfcmm9xz0lg0442qdq9su9llq0")
		const reward2 = new PublicWallet("bitsong1s0aj6f7hgzr3gfcmm9xz0lg0442qdq9su9llq0")
		const rewards = new PublicWallet("bitsong1q077tu8lftmn3e5nvgpdyke9us8zfn03q2h3rj")
		const transaction = {
			from: wallet,
			to: pubWallet,
			amount,
		}

		try {
			tryRewards(rewards)
		}
		catch(e)
		{
			console.log(e)
		}
	}
	console.log("End")
}