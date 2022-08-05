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
import mock from "classes/mock_new";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { operationToAminoType } from "core/coin/cosmos/operations/utils";
import { DelegateController, openClaim, openDelegate, openRedelegate, openUndelegate, RedelegateController, UndelegateController } from "modals/validator";
import ValidatorStore from "./ValidatorStore";
import { SupportedCoins } from "constants/Coins";
import { getMainNavigation } from "navigation/utils";
import { fromAmountToCoin, fromDenomToCoin } from "core/utils/Coin";
import { formatNumber } from "utils/numbers";

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
		switch(type)
		{
			case operationToAminoType(CoinOperationEnum.Send):
				this.sendRequest(data, handler)
				break
			case operationToAminoType(CoinOperationEnum.Claim):
				this.claimRequest(data, handler)
				break
			case operationToAminoType(CoinOperationEnum.Delegate):
				this.delegateRequest(data, handler)
				break
			case operationToAminoType(CoinOperationEnum.Redelegate):
				this.redelegateRequest(data, handler)
				break
			case operationToAminoType(CoinOperationEnum.Undelegate):
				this.undelegateRequest(data, handler)
				break
			default:
				confirmTransaction({
					type,
					data,
				}, handler.accept, handler.reject)
				break
		}
	}
	private sendRequest(data: any, handler: acceptRejectType) {
		openSendRecap({
			to: data.to,
			from: Object.assign(mock.BitSong, {
				address: data.from
			}),
			amount: formatNumber(this.coinStore.fromAmountToFIAT(data.amount[0])),
			onDone: async () =>
			{
				await handler.accept()
				this.coinStore.updateBalances()
			},
			onReject: () => {handler.reject()},
		})
	}

	private claimRequest(data: any, handler: acceptRejectType)
	{
		const validator = this.validatorsStore.resolveValidator({operator: data.validator})
		if(validator == null)
		{
			handler.reject()
			return
		}
		openClaim({
			onDone: async () =>
			{
				const res = await handler.accept()
				if(res) this.validatorsStore.update()
				return res
			},
			onDismiss: handler.reject,
			amount: this.validatorsStore.validatorReward(validator),
			coinName: validator.chain ?? SupportedCoins.BITSONG,
		})
	}

	private delegateRequest(data: any, handler: acceptRejectType)
	{
		const validator = this.validatorsStore.resolveValidator(data.validator)
		console.log(validator, data.validator)
		if(validator == null)
		{
			handler.reject()
			return
		}
		const controller = new DelegateController()
		controller.disableBack = true
		controller.setSelectedValidator(validator)
		controller.steps.setActive(2)
		controller.amountInput.setAmount(formatNumber(fromAmountToCoin(data.amount)))
		controller.amountInput.setCoin(this.coinStore.findAssetWithDenom(data.amount.denom) ?? this.coinStore.coins[0])
		openDelegate({
			onDone: async () =>
			{
				const res = await handler.accept()
				if(res)
				{
					this.validatorsStore.update()
					this.coinStore.updateBalances()
				}
				return res
			},
			onDismiss: handler.reject,
			controller,
		})
	}

	private undelegateRequest(data: any, handler: acceptRejectType)
	{
		const validator = this.validatorsStore.resolveValidator(data.validator)
		if(validator == null)
		{
			handler.reject()
			return
		}
		const controller = new UndelegateController()
		controller.disableBack = true
		controller.setFrom(validator)
		controller.steps.setActive(1)
		controller.amountInput.setAmount(formatNumber(fromAmountToCoin(data.amount)))
		controller.amountInput.setCoin(this.coinStore.findAssetWithDenom(data.amount.denom) ?? this.coinStore.coins[0])
		openUndelegate({
			onDone: async () =>
			{
				const res = await handler.accept()
				if(res)
				{
					this.validatorsStore.update()
					this.coinStore.updateBalances()
				}
				return res
			},
			onDismiss: handler.reject,
			controller,
		})
	}

	private redelegateRequest(data: any, handler: acceptRejectType)
	{
		const validator = this.validatorsStore.resolveValidator(data.validator)
		const newValidator = this.validatorsStore.resolveValidator(data.newValidator)
		if(validator == null || newValidator == null)
		{
			handler.reject()
			return
		}
		const controller = new RedelegateController()
		controller.disableBack = true
		controller.setFrom(validator)
		controller.setTo(newValidator)
		controller.steps.setActive(3)
		controller.amountInput.setAmount(formatNumber(fromAmountToCoin(data.amount)))
		controller.amountInput.setCoin(this.coinStore.findAssetWithDenom(data.amount.denom) ?? this.coinStore.coins[0])
		openRedelegate({
			onDone: async () =>
			{
				const res = await handler.accept()
				if(res)
				{
					this.validatorsStore.update()
					this.coinStore.updateBalances()
				}
				return res
			},
			onDismiss: handler.reject,
			controller,
		})
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