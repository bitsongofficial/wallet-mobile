import { AminoSignResponse, StdSignDoc } from "@cosmjs-rn/amino";
import WalletConnect from "@walletconnect/client"
import { IWalletConnectSession, IWalletConnectOptions } from "@walletconnect/types"
import { SupportedCoins } from "constants/Coins";
import { Wallet } from "core/types/storing/Generic";
import { makeAutoObservable } from "mobx";
import Config from "react-native-config";

export interface WalletInterface {
	Address(chain: SupportedCoins): Promise<string>
	Wallet(chain: SupportedCoins): Wallet
	get Name(): string
	Algorithm(chain?: SupportedCoins): string
	PubKey(chain: SupportedCoins): Promise<Uint8Array>
	Sign(chain: SupportedCoins, signDoc: StdSignDoc, signerAddress?: string): Promise<AminoSignResponse | undefined>
}

export type WalletConnectOptions = {
	uri?: string,
	session?: IWalletConnectSession,
	fcmToken?: string,
	name?: string,
	date?: Date,
	walletInterface: WalletInterface,
}

enum WalletConnectEvents {
	SessionRequest = "session_request",
	Connect = "connect",
	Disconnect = "disconnect",
	CallRequest = "call_request",
}

export type WalletConnectCallback = (error: Error | null, payload: any | null) => void
export type WalletConnectVersionedCallbacks = WalletConnectCallback | {[k: string]: WalletConnectCallback}

export interface WalletConnectEventsMap {
	[k: string]: WalletConnectVersionedCallbacks
}
export interface WalletConnectBaseEvents extends WalletConnectEventsMap {
	[WalletConnectEvents.SessionRequest]: WalletConnectCallback,
	[WalletConnectEvents.Connect]: WalletConnectCallback,
	[WalletConnectEvents.Disconnect]: WalletConnectCallback,
	[WalletConnectEvents.CallRequest]: WalletConnectVersionedCallbacks,
}

export abstract class WalletConnectConnectorV1<E extends WalletConnectBaseEvents> {
	connector: WalletConnect | null = null
	walletInterface: WalletInterface
	name: string = ""
	date: Date | null = null
	abstract events: E
	constructor(options: WalletConnectOptions)
	{
		this.walletInterface = options.walletInterface
		if(options.name) this.name = options.name
		if(options.date) this.date = options.date
		const wcOptions: IWalletConnectOptions = 
		{
			// Required
			clientMeta: {
				description: "Bitsong Mobile Wallet",
				url: "https://bitsong.io/",
				icons: ["https://walletconnect.org/walletconnect-logo.png"],
				name: "Bitsong",
			},
		}
		if(options.uri) wcOptions.uri = options.uri
		else if (options.session) wcOptions.session = options.session
		let pushServerOptins = undefined
		if(options.fcmToken && Config.PUSH_NOTIFICATION_SERVER_URL)
		{
			pushServerOptins = {
				url: Config.PUSH_NOTIFICATION_SERVER_URL,
				type: 'fcm',
				token: options.fcmToken,
				peerMeta: true,
				language: 'it',
			}
		}
		const connector = new WalletConnect(wcOptions, pushServerOptins)
		this.connector = connector
		connector.on(WalletConnectEvents.SessionRequest, async (error, payload) =>
		{
			if (error) {
				throw error;
			}
			if(this.name == "") this.name = payload.params.peerMeta ? payload.params.peerMeta.name : undefined
			this.events[WalletConnectEvents.SessionRequest](error, payload)
		})
		connector.on(WalletConnectEvents.Connect, async (error, payload) =>
		{
			if (error) {
				throw error;
			}
			if(this.date != null) this.setDate(new Date())
			this.events[WalletConnectEvents.Connect](error, payload)
		})
		connector.on(WalletConnectEvents.CallRequest, async (error, payload) =>
		{
			if (error) {
			  throw error;
			}
			const specificEvent = this.events[payload.method]
			if(specificEvent)
			{
				if(typeof specificEvent === 'object') specificEvent[payload.jsonrpc](error, payload)
				else specificEvent(error, payload)
			}
			else this.events[WalletConnectEvents.CallRequest]
		})
		connector.on(WalletConnectEvents.Disconnect, (error, payload) =>
		{
			if (error) {
			  	throw error
			}
			this.events[WalletConnectEvents.Disconnect]
		})
	}

	setDate(date: Date)
	{
		this.date = date
	}

	approve(payload: any | null, result: any[])
	{
		this.connector?.approveRequest({
			id: payload.id,
			jsonrpc: payload.jsonrpc,
			result,
		})
	}

	reject(payload: any | null, error: Error)
	{
		this.connector?.rejectRequest({
			id: payload.id,
			jsonrpc: payload.jsonrpc,
			error
		})
	}
}