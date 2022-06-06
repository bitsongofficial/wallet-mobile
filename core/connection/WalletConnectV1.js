import WalletConnect from "@walletconnect/client"

export class WalletConnectCosmosClientV1 {
	connector = null
	wallets
	constructor(uri, wallets)
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

			const accounts = await this.getAccounts()

			connector.approveSession({
				accounts,
				chainId: 1                  // required
			})
		})
		connector.on("call_request", (error, payload) => {
			if (error) {
			  throw error;
			}
			connector.approveRequest({
			  
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
		const accountRequests = []
		const accounts = []
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
		this.connector.connect()
	}
}