import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { makeAutoObservable } from "mobx";
import { openSendRecap } from "screens/SendModalScreens/OpenSendRecap";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore from "./WalletStore";
import { IWalletConnectSession } from "@walletconnect/types"
import LocalStorageManager from "./LocalStorageManager";
import SettingsStore from "./SettingsStore";
import { confirmTransaction } from "components/organisms/TransactionSignConfirm";
import mock from "classes/mock";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { operationToAminoType } from "core/coin/cosmos/operations/utils";
import { openClaim } from "modals/validator";
import ValidatorStore from "./ValidatorStore";
import { SupportedCoins } from "constants/Coins";
import { getMainNavigation } from "navigation/utils";

export default class DappConnectionStore {
	localStorageManager?: LocalStorageManager
	connections: WalletConnectCosmosClientV1[] = []

	loading = {
	  checkNick: false,
	};

	async checkNick(nick: string) {
	  return true;
	}

	constructor(private walletStore: WalletStore, private coinStore: CoinStore, private validatorsStore: ValidatorStore, private remoteConfigsStore: RemoteConfigsStore, private settingsStore: SettingsStore)
	{
		makeAutoObservable(this, {}, { autoBind: true })
		// AsyncStorageLib.removeItem(session_location)
	}

	async connect(pairString?: string, session?: IWalletConnectSession, name?: string, date?: Date)
	{
		if(this.walletStore.activeWallet)
		{
			try
			{
				this.connections.push(new WalletConnectCosmosClientV1({
					uri: pairString,
					session,
					wallets: [this.walletStore.activeWallet.wallets.btsg],
					fcmToken: this.settingsStore.notifications.enable ? this.remoteConfigsStore.pushNotificationToken : undefined,
					onRequest: this.onRequest,
					onConnect: this.onConnect,
					onDisconnect: this.onDisconnect,
				}))
			}
			catch(e)
			{
				throw e
			}
		}
		else
		{
			throw new Error("No active wallet to use in connection")
		}
	}

	private onRequest(type: string, data: any, handler: acceptRejectType)
	{
		const navigation = getMainNavigation()
		console.log(type, operationToAminoType(CoinOperationEnum.Claim))
		switch(type)
		{
			case operationToAminoType(CoinOperationEnum.Send):
				openSendRecap({
					to: data.to,
					from: Object.assign(mock.BitSong, {
						address: data.from
					}),
					amount: this.coinStore.fromAmountToFIAT(data.amount[0]).toFixed(2),
					onDone: async () =>
					{
						await handler.accept()
						this.coinStore.updateBalances()
					},
					onReject: () => {handler.reject()},
				})
				break
			case operationToAminoType(CoinOperationEnum.Claim):
				const validator = this.validatorsStore.resolveValidator({operator: data.validator})
				if(validator == null)
				{
					handler.reject()
					return
				}
				const {accept, reject} = handler
				openClaim({
					onDone: async () =>
					{
						const res = await accept()
						if(res) this.validatorsStore.update()
						return res
					},
					onDismiss: reject,
					amount: this.validatorsStore.validatorReward(validator),
					coinName: validator.chain ?? SupportedCoins.BITSONG,
				})
				break
			default:
				confirmTransaction(data, handler.accept, handler.reject)
				break
		}
	}

	// private getExclusiveHandler(handler: acceptRejectType): acceptRejectType
	// {
	// 	const status = {accepted: false}
	// 	return {
	// 		accept: () =>
	// 		{
	// 			console.log("Accept")
	// 			status.accepted = true
	// 			handler.accept()
	// 		},
	// 		reject: () =>
	// 		{
	// 			if(!status.accepted)
	// 			{
	// 				console.log("Reject")
	// 				handler.reject()
	// 			}
	// 		}
	// 	}
	// }

	private onConnect(connection: WalletConnectCosmosClientV1)
	{
		if(this.localStorageManager) this.localStorageManager.saveConnections()
	}

	async disconnect(connection: WalletConnectCosmosClientV1)
	{
		try
		{
			await connection.connector?.killSession()
		}
		catch(e){}
		const connectionIndex = this.connections.indexOf(connection)
		if(connectionIndex >= 0)
		{
			this.connections.splice(connectionIndex, 1)
			if(this.localStorageManager) this.localStorageManager.saveConnections()
		}
	}

	private onDisconnect(connection: WalletConnectCosmosClientV1)
	{
		this.disconnect(connection)
	}
}