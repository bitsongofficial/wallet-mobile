import WalletConnect from "@walletconnect/client"
import { IWalletConnectSession, IWalletConnectOptions } from "@walletconnect/types"
import { Bitsong } from "core/coin/bitsong/Bitsong";
import { operationToAminoType } from "core/coin/cosmos/operations/utils";
import { PublicWallet } from "core/storing/Generic";
import { CosmosWallet } from "core/storing/Wallet";
import { ClaimData } from "core/types/coin/cosmos/ClaimData";
import { DelegateData } from "core/types/coin/cosmos/DelegateData";
import { DepositData } from "core/types/coin/cosmos/DepositData";
import { ProposalVote } from "core/types/coin/cosmos/ProposalVote";
import { RedelegateData } from "core/types/coin/cosmos/RedelegateData";
import { SubmitProposalData } from "core/types/coin/cosmos/SubmitProposalData";
import { CoinClasses } from "core/types/coin/Dictionaries";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { Wallet } from "core/types/storing/Generic";
import { TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { makeAutoObservable } from "mobx";
import Config from "react-native-config";

export class WalletConnectCosmosClientV1 {
	connector: WalletConnect | null = null
	wallets
	name?: string
	date?: Date
	pendingAction: (() => void) | null = null
	confirmationExtraData: any
	onConnect?: (connection: WalletConnectCosmosClientV1) => void
	onDisconnect?: (connection: WalletConnectCosmosClientV1) => void
	constructor(options: {
		uri?: string,
		session?: IWalletConnectSession,
		wallets: Wallet[],
		fcmToken?: string,
		onRequest?: (type:string, data:any, handler: acceptRejectType) => void,
		onConnect?: (connection: WalletConnectCosmosClientV1) => void,
		onDisconnect?: (connection: WalletConnectCosmosClientV1) => void,
	})
	{
		const Bitsong = CoinClasses.btsg
		makeAutoObservable(this, {}, { autoBind: true })
		this.wallets = options.wallets
		this.onConnect = options.onConnect
		this.onDisconnect = options.onDisconnect
		const wcOptions: IWalletConnectOptions = 
		{
			// Required
			clientMeta: {
				description: "WalletConnect Developer App",
				url: "https://walletconnect.org",
				icons: ["https://walletconnect.org/walletconnect-logo.png"],
				name: "WalletConnect",
			},
		}
		if(options.uri) wcOptions.uri = options.uri
		else if (options.session) wcOptions.session = options.session
		const connector = options.fcmToken ? new WalletConnect(
			wcOptions,
			{
			   url: Config.PUSH_NOTIFICATION_SERVER_URL,
			   type: 'fcm',
			   token: options.fcmToken,
			   peerMeta: true,
			   language: 'it',
			}
		) : new WalletConnect(wcOptions)
		connector.on("session_request", async (error, payload) => {
			if (error) {
				throw error;
			}
			console.log("session_request")
			const accounts = await this.getAccounts()

			connector.approveSession({
				accounts,
				chainId: 1                  // required
			})
			this.name = payload.params.peerMeta ? payload.params.peerMeta.name : undefined
		})
		connector.on("connect", async () =>
		{
			console.log("connected")
			this.setDate(new Date())
			if(this.onConnect) this.onConnect(this)
		})
		connector.on("call_request", async (error, payload) => {
			console.log("call_request")
			if (error) {
			  throw error;
			}
			const params = payload.params[0]
			let data
			let accept:anonymousHandler = () => null
			let reject:anonymousHandler = () => connector.rejectRequest({
				id: payload.id,
				error: {
					code: 1,
					message: "Rejected",
				}
			})
			const approve = (res: any) =>
			{
				try
				{
					this.connector?.approveRequest({
						id: payload.id,
						result: res,
						jsonrpc: payload.method,
					})
				}
				catch(e)
				{
					console.error("Catched", e)
				}
			}
			let wallet: CosmosWallet | false = false
			let operationData: any = {}
			switch(params.typeUrl)
			{
				case operationToAminoType(CoinOperationEnum.Send):
					wallet = await this.getWalletOrReject(params.value.fromAddress, reject)
					if(!wallet) return
					const sendParams = {
						from: wallet,
						to: new PublicWallet(params.value.toAddress),
						amount: params.value.amount
					}
					
					accept = async () =>
					{
						const res = await Bitsong.Do(CoinOperationEnum.Send, sendParams)
						approve(res)
						return res
					}

					data = {
						to: params.value.toAddress,
						amount: sendParams.amount,
						from: params.value.fromAddress,
					}
					break
				case operationToAminoType(CoinOperationEnum.Delegate):
					wallet = await this.getWalletOrReject(params.value.delegatorAddress, reject)
					if(!wallet) return
					operationData = {
						delegator: wallet,
						validator: {operator: params.value.validatorAddress},
						amount: params.value.amount
					}
					data = operationData
					accept = async () =>
					{
						const data: DelegateData = operationData
						const res = await Bitsong.Do(CoinOperationEnum.Delegate, data)
						approve(res)
						return res
					}
					break
				case operationToAminoType(CoinOperationEnum.Redelegate):
					wallet = await this.getWalletOrReject(params.value.delegatorAddress, reject)
					if(!wallet) return
					operationData = {
						delegator: wallet,
						validator: {operator: params.value.validatorSrcAddress},
						newValidator: {operator: params.value.validatorDstAddress},
						amount: params.value.amount
					}
					data = operationData
					accept = async () =>
					{
						const data: RedelegateData = operationData
						const res = await Bitsong.Do(CoinOperationEnum.Redelegate, data)
						approve(res)
						return res
					}
					break
				case operationToAminoType(CoinOperationEnum.Undelegate):
					wallet = await this.getWalletOrReject(params.value.delegatorAddress, reject)
					if(!wallet) return
					operationData = {
						delegator: wallet,
						validator: {operator: params.value.validatorAddress},
						amount: params.value.amount
					}
					data = operationData
					accept = async () =>
					{
						const data: DelegateData = operationData
						const res = await Bitsong.Do(CoinOperationEnum.Undelegate, data)
						approve(res)
						return res
					}
					break
				case operationToAminoType(CoinOperationEnum.Claim):
					wallet = await this.getWalletOrReject(params.value.delegatorAddress, reject)
					if(!wallet) return
					const claimData = {
						owner: wallet,
						validators: [{operator: params.value.validatorAddress} as any],
					}
					data = {
						owner: wallet,
						validator: params.value.validatorAddress,
					}
					data = operationData
					accept = async () =>
					{
						const data: ClaimData = claimData
						const res = await Bitsong.Do(CoinOperationEnum.Claim, data)
						approve(res)
						return res
					}
					break
				case operationToAminoType(CoinOperationEnum.Vote):
					wallet = await this.getWalletOrReject(params.value.voter, reject)
					if(!wallet) return
					operationData = {
						voter: wallet,
						proposal: {id: params.value.proposalId},
						choice: params.value.option,
					}
					data = operationData
					accept = async () =>
					{
						const data: ProposalVote = operationData
						const res = await Bitsong.Do(CoinOperationEnum.Vote, data)
						approve(res)
						return res
					}
					break
				case operationToAminoType(CoinOperationEnum.Deposit):
					wallet = await this.getWalletOrReject(params.value.depositor, reject)
					if(!wallet) return
					operationData = {
						depositor: wallet,
						proposal: {id: params.value.proposalId},
						amount: params.value.amount[0],
					}
					data = operationData
					accept = async () =>
					{
						const data: DepositData = operationData
						const res = await Bitsong.Do(CoinOperationEnum.Deposit, data)
						approve(res)
						return res
					}
					break

				case operationToAminoType(CoinOperationEnum.SubmitProposal):
					wallet = await this.getWalletOrReject(params.value.proposer, reject)
					if(!wallet) return
					const content = TextProposal.decode(Uint8Array.from(Object.values(params.value.content.value)))
					operationData = {
						proposer: wallet,
						proposal: {
							id: params.value.proposalId,
							title: content.title,
							description: content.description,
						},
						initialDeposit: params.value.initialDeposit[0],
					}
					data = operationData
					accept = async () =>
					{
						const data: SubmitProposalData = operationData
						const res = await Bitsong.Do(CoinOperationEnum.SubmitProposal, data)
						approve(res)
						return res
					}
					break
			}		
			
			if(options.onRequest) options.onRequest(params.typeUrl, data, {
				accept,
				reject
			})
		})
		connector.on("disconnect", (error, payload) => {
			console.log("disconnected")
			if(this.onDisconnect) this.onDisconnect(this)
			if (error) {
			  	throw error
			}
		})
		this.connector = connector
	}

	async getWalletOrReject(targetAddress: string, reject: () => void)
	{
		let fromWallet: CosmosWallet | undefined = undefined
		for(const wallet of this.wallets)
		{
			const address = await wallet.Address()
			if(address == targetAddress) fromWallet = wallet as CosmosWallet
		}

		if(fromWallet == undefined)
		{
			reject()
			return false
		}
		const actualFromWallet: CosmosWallet = fromWallet

		return fromWallet
	}

	async getAccounts()
	{
		const accountRequests:Promise<void>[] = []
		const accounts:string[] = []
		this.wallets.forEach(w => {
			const request = async () =>
			{
				accounts.push(await w.Address())
			}
			accountRequests.push(request())
		})
		await Promise.all(accountRequests)
		return accounts
	}

	setDate(date: Date)
	{
		this.date = date
	}
}