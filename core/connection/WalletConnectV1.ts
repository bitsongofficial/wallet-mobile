import WalletConnect from "@walletconnect/client"
import { Bitsong } from "core/coin/bitsong/Bitsong";
import { PublicWallet } from "core/storing/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { Wallet } from "core/types/storing/Generic";

export class WalletConnectCosmosClientV1 {
	connector: WalletConnect | null = null
	wallets
	constructor(uri: string, wallets: Wallet[])
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
			// {
			//   // Optional
			//   url: "<YOUR_PUSH_SERVER_URL>",
			//   type: "fcm",
			//   token: token,
			//   peerMeta: true,
			//   language: language,
			// }
		);
		connector.on("session_request", async (error, payload) => {
			if (error) {
				throw error;
			}
			console.log("session_request")
			const accounts = await this.getAccounts()
			console.log(accounts)

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
			console.log(params)
			switch(params.typeUrl)
			{
				case "/cosmos.bank.v1beta1.MsgSend":
					let fromWallet = null
					for(const wallet of this.wallets)
					{
						console.log(wallet)
						const address = await wallet.Address()
						console.log(address)
						if(address == params.value.fromAddress) fromWallet = wallet
					}
					console.log(fromWallet)
					if(fromWallet)
					{
						const sendParams = {
							from: fromWallet,
							to: new PublicWallet(params.value.toAddress),
							amount: params.value.amount
						}
						console.log(sendParams)
						const res = await Bitsong.Do(CoinOperationEnum.Send, sendParams)
						console.log(res)
						connector.approveRequest({
							id: payload.id,
						  	result: res,
							jsonrpc: payload.method,
						})
					}
					else
					{
						connector.rejectRequest({})
					}
			}
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
		console.log(this.wallets)
		this.wallets.forEach(w => {
			console.log(w)
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