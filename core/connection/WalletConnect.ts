import WalletConnectClient from "@walletconnect/client"

import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes, ClientTypes, AppMetadata } from "@walletconnect/types";
import { WalletConnectAsyncStorage } from "core/storing/WalletConnectAsyncStorage";
import { Wallet } from "core/types/storing/Generic";

export class WalletConnectCosmosClient {
	private wcClient?: WalletConnectClient
	constructor(private wallets: Wallet[])
	{
	}

	private getMetadata(): AppMetadata
	{
		return {
			name: "Bitsong Wallet",
			description: "Bitsong Official Wallet",
			url: "#",
			icons: ["https://walletconnect.com/walletconnect-logo.png"],
		}
	}

	private async getAccounts(): Promise<string[]>
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

	private async handleSessionUserApproval(approved: boolean, proposal: SessionTypes.Proposal)
	{
		if (approved) {
			const response: SessionTypes.ResponseInput = {
				state: {
					accounts: await this.getAccounts(),
				},
				metadata: this.getMetadata()
			};
			const approveParams: ClientTypes.ApproveParams = {
				proposal,
				response,
			}
			await this.wcClient?.approve({ proposal, response });
		}
		else 
		{
			// if user didn't approve then reject with no response
			await this.wcClient?.reject({ proposal });
		}
	}

	private checkValidDapp(proposal: SessionTypes.Proposal)
	{
		return true
	}

	private checkUserApproval()
	{
		return true
	}

	public static async init(wallets: Wallet[])
	{
		const wccc = new WalletConnectCosmosClient(wallets)
		const client = await WalletConnectClient.init({
			controller: true,
			projectId: "0e46a2e7548a26fef2ee41e9adc61251",
			relayUrl: "wss://relay.walletconnect.com",
			metadata: wccc.getMetadata(),
			storageOptions: {
			  	asyncStorage: new WalletConnectAsyncStorage(),
			},
		})

		wccc.wcClient = client

		client.on(
			CLIENT_EVENTS.session.proposal,
			async (proposal: SessionTypes.Proposal) => {
				const { proposer, permissions } = proposal;
				const { metadata } = proposer;
				console.log("proposal: ", proposal)
				let approved: boolean = wccc.checkValidDapp(proposal) && wccc.checkUserApproval();
				wccc.handleSessionUserApproval(approved, proposal);
			}
		)
		
		client.on(
			CLIENT_EVENTS.session.created,
			async (session: SessionTypes.Created) => {
				// session created succesfully
				console.log("created: ", session)
			}
		)

		client.on(
			CLIENT_EVENTS.session.request,
			async (data:any) => {
				console.log("message: ", data)
			}
		)

		return wccc
	}
	
	public async pair(uri: string)
	{
		try {
			const res = await this.wcClient?.pair({ uri })
			console.log("res: ", res)
		}
		catch(e)
		{
			console.log("pairError: ", e)
		}
	}
}