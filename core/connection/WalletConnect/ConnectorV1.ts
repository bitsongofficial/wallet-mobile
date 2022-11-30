import { AminoSignResponse, StdSignDoc } from "@cosmjs-rn/amino";
import WalletConnect from "@walletconnect/client"
import { IWalletConnectSession, IWalletConnectOptions } from "@walletconnect/types"
import { SupportedCoins } from "constants/Coins";
import { Wallet } from "core/types/storing/Generic";
import { makeAutoObservable, makeObservable, runInAction } from "mobx";
import Config from "react-native-config";
import { ConnectionMeta } from "stores/DappConnectionStore";
import { ConnectorMeta } from "./ConnectorMeta";

export interface WalletInterface {
	Address(chain: SupportedCoins): Promise<string>
	Wallet(chain: SupportedCoins): Wallet | undefined
	get Name(): string
	Algorithm(chain?: SupportedCoins): string
	PubKey(chain: SupportedCoins): Promise<Uint8Array>
	Sign(chain: SupportedCoins, signDoc: StdSignDoc, signerAddress?: string): Promise<AminoSignResponse | undefined>
}

export type WalletConnectOptions = {
	uri?: string,
	session?: IWalletConnectSession,
	fcmToken?: string,
	meta?: ConnectionMeta,
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
	meta = new ConnectorMeta()
	abstract events: E
	constructor(options: WalletConnectOptions)
	{
		this.walletInterface = options.walletInterface
		if(options.meta)
		{
			if(options.meta.name) this.meta.setName(options.meta.name)
			if(options.meta.url) this.meta.setUrl(options.meta.url)
			if(options.meta.icon) this.meta.setIcon(options.meta.icon)
			if(options.meta.description) this.meta.setDescription(options.meta.description)
			if(options.meta.date) this.meta.setDate(options.meta.date)
		}
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
			runInAction(() =>
			{
				const peerMeta = payload.params[0].peerMeta
				if(this.meta.name == "") this.setName(peerMeta ? peerMeta.name : "")
				if(this.meta.url == "") this.setUrl(peerMeta ? peerMeta.url : "")
				if(this.meta.icon == "") this.setIcon(peerMeta && peerMeta.icons && peerMeta.icons.length > 0 ? peerMeta.icons[0] : "")
				if(this.meta.description == "") this.setDescription(peerMeta ? peerMeta.description : "")
			})
			this.events[WalletConnectEvents.SessionRequest](error, payload)
		})
		connector.on(WalletConnectEvents.Connect, async (error, payload) =>
		{
			if (error) {
				throw error;
			}
			runInAction(() =>
			{
				if(this.meta.date == null) this.setDate(new Date())
			})
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
		this.meta.setDate(date)
	}

	setName(name: string)
	{
		this.meta.setName(name)
	}

	setUrl(url: string)
	{
		this.meta.setUrl(url)
	}

	setIcon(icon: string)
	{
		this.meta.setIcon(icon)
	}

	setDescription(description: string)
	{
		this.meta.setDescription(description)
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