import WalletConnect from "@walletconnect/client"
import { Transaction } from "classes";
import { Bitsong } from "core/coin/bitsong/Bitsong";
import { PublicWallet } from "core/storing/Generic";
import { Amount } from "core/types/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { Wallet } from "core/types/storing/Generic";
import { fromAmountToDollars } from "core/utils/Coin";
import Config from "react-native-config";
import { store } from "stores/Store";

export class WalletConnectCosmosClientV1 {
	connector: WalletConnect | null = null
	wallets
	pendingAction: (() => void) | null = null
	confirmationExtraData: any
	constructor(uri: string, wallets: Wallet[], fcmToken: string, onRequest: (type:string, data:any, handler: acceptRejectType) => void)
	{
		this.wallets = wallets
		const connector = new WalletConnect(
			{
				// Required
				uri,
				// Required
				clientMeta: {
					description: "WalletConnect Developer App",
					url: "https://walletconnect.org",
					icons: ["https://walletconnect.org/walletconnect-logo.png"],
					name: "WalletConnect",
				},
			},
			{
			   url: Config.PUSH_NOTIFICATION_SERVER_URL,
			   type: 'fcm',
			   token: fcmToken,
			   peerMeta: true,
			   language: 'it',
			}
		);
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

			onRequest(params.typeUrl, data, {
				accept,
				reject
			})
		})
		connector.on("disconnect", (error, payload) => {
			if (error) {
			  throw error;
			}
		})
		this.connector = connector
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

	connect()
	{
		console.log("connect...")
		this.connector?.connect()
	}
}