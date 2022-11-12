import WalletConnect from "@walletconnect/client"
import { IWalletConnectSession, IWalletConnectOptions } from "@walletconnect/types"
import { makeAutoObservable } from "mobx";
import Config from "react-native-config";

export type WalletConnectOptions = {
	uri?: string,
	session?: IWalletConnectSession,
	fcmToken?: string,
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
	name?: string
	date?: Date
	abstract events: E
	constructor(options: WalletConnectOptions)
	{
		makeAutoObservable(this, {}, { autoBind: true })
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
			this.name = payload.params.peerMeta ? payload.params.peerMeta.name : undefined
			this.events[WalletConnectEvents.SessionRequest](error, payload)
		})
		connector.on(WalletConnectEvents.Connect, async (error, payload) =>
		{
			this.setDate(new Date())
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
}