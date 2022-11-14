import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { makeAutoObservable } from "mobx";
import { openSendRecap } from "modals/wallets";
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
import { getMainNavigation, navigate } from "navigation/utils";
import { fromAmountToCoin, fromDenomToCoin } from "core/utils/Coin";
import { formatNumber } from "utils/numbers";
import ProposalsStore from "./ProposalsStore";
import { openDeposit, openVoteRecap } from "modals/proposal";
import { DepositController } from "modals/proposal/components/templates";
import { WalletInterface } from "core/connection/WalletConnect/ConnectorV1";
import { Wallet } from "core/types/storing/Generic";
import { CosmosWallet } from "core/storing/Wallet";
import { Secp256k1HdWallet, StdSignDoc } from "@cosmjs-rn/amino";

class storeDrivenWalletInterface implements WalletInterface {
	constructor(private walletStore: WalletStore, private profileId: string) {}
	async Address(chain: SupportedCoins) {
		return await this.walletStore.address(this.profileId, chain) ?? ""
	}
	Wallet(chain: SupportedCoins): Wallet {
		throw new Error("Method not implemented.");
	}
	get Name() {
		return this.walletStore.name(this.profileId)
	}
	Algorithm(chain: SupportedCoins | undefined) {
		return "secp256k1"
	}
	async PubKey(chain: SupportedCoins) {
		const key = await this.walletStore.chainWallet(this.profileId, chain)?.PubKey()
		return key ?? new Uint8Array()
	}
	async Sign(chain: SupportedCoins, signDoc: StdSignDoc, signerAddress?: string) {
		try
		{
			const wallet = this.walletStore.chainWallet(this.profileId, chain) as CosmosWallet
			const [address, signer] = await Promise.all([wallet.Address(), wallet.AminoSigner()])
			return await signer.signAmino(signerAddress ?? address, signDoc)
		}
		catch(e)
		{
			console.error("Catched", e)
		}

		return undefined
	}
}

export default class DappConnectionStore {
	localStorageManager?: LocalStorageManager
	connections: WalletConnectCosmosClientV1[] = []

	loading = {
	  checkNick: false,
	};

	async checkNick(nick: string) {
	  return true;
	}

	constructor(
		private walletStore: WalletStore,
		private coinStore: CoinStore,
		private validatorsStore: ValidatorStore,
		private proposalsStore: ProposalsStore,
		private remoteConfigsStore: RemoteConfigsStore,
		private settingsStore: SettingsStore)
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
			case operationToAminoType(CoinOperationEnum.SubmitProposal):
				this.submitProposalRequest(data, handler)
				break
			case operationToAminoType(CoinOperationEnum.Deposit):
				this.depositRequest(data, handler)
				break
			case operationToAminoType(CoinOperationEnum.Vote):
				this.voteRequest(data, handler)
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
				const res = await handler.accept()
				this.coinStore.updateBalances()
				return res
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

	private submitProposalRequest(data: any, handler: acceptRejectType) {
		navigate("NewProposal", {
			title: data.proposal.title,
			description: data.proposal.description,
			initialDeposit: fromAmountToCoin(data.initialDeposit),
			chain: (data.chain as SupportedCoins) ?? SupportedCoins.BITSONG,
			passive: true,
			onDone: async () =>
			{
				navigate("Loader", {
					callback: async () =>
					{
						const res = await handler.accept()
						if(res)
						{
							this.proposalsStore.update()
							this.coinStore.updateBalances()
						}
						return res
					}
				})
			},
			onDismiss: handler.reject,
		})
	}
	private depositRequest(data: any, handler: acceptRejectType) {
		data.proposal.coin = data.chain ?? SupportedCoins.BITSONG
		const proposal = this.proposalsStore.resolveProposal(data.proposal)
		if(proposal)
		{
			const controller = new DepositController()
			controller.setMinDeposit(this.proposalsStore.minDeposit(proposal))
			controller.amountInput.setAmount(fromAmountToCoin(data.amount).toString())
			controller.steps.goTo("Deposit Recap")
			openDeposit({
				proposal,
				controller,
				onDone: async () =>
				{
					const res = await handler.accept()
					if(res)
					{
						this.proposalsStore.update()
						this.coinStore.updateBalances()
					}
					return res
				},
				onDismiss: handler.reject,
			})
		}
		else
		{
			handler.reject()
		}
	}
	private voteRequest(data: any, handler: acceptRejectType) {
		openVoteRecap({
			value: data.option,
			chain: data.chain ?? SupportedCoins.BITSONG,
			onDone: async () =>
			{
				navigate("Loader", {
					callback: async () =>
					{
						const res = await handler.accept()
						if(res)
						{
							this.proposalsStore.update()
						}
						return res
					}
				})
			},
			onDismiss: handler.reject
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