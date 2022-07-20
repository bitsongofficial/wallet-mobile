import WalletConnect from "@walletconnect/client"
import { IWalletConnectSession, IWalletConnectOptions } from "@walletconnect/types"
import { Bitsong } from "core/coin/bitsong/Bitsong";
import { PublicWallet } from "core/storing/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { Wallet } from "core/types/storing/Generic";
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
			switch(params.typeUrl)
			{
				case "/cosmos.bank.v1beta1.MsgSend":
					let fromWallet = null
					for(const wallet of this.wallets)
					{
						const address = await wallet.Address()
						if(address == params.value.fromAddress) fromWallet = wallet
					}
					if(fromWallet)
					{
						const sendParams = {
							from: fromWallet,
							to: new PublicWallet(params.value.toAddress),
							amount: params.value.amount
						}
						
						accept = async () =>
						{
							const res = await Bitsong.Do(CoinOperationEnum.Send, sendParams)
							this.connector?.approveRequest({
								id: payload.id,
								result: res,
								jsonrpc: payload.method,
							})
						}

						data = {
							to: params.value.toAddress,
							amount: sendParams.amount,
						}
					}
					else
					{
						reject()
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

		makeAutoObservable(this)
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