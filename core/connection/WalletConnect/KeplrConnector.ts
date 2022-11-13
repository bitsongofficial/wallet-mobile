import { SupportedCoins } from "constants/Coins";
import { WalletConnectBaseEvents, WalletConnectCallback, WalletConnectConnectorV1, WalletConnectOptions, WalletConnectVersionedCallbacks } from "./ConnectorV1";

export interface KeplrEvents extends WalletConnectBaseEvents {
    keplr_enable_wallet_connect_v1: WalletConnectVersionedCallbacks,
    keplr_get_key_wallet_connect_v1: WalletConnectVersionedCallbacks,
    keplr_sign_amino_wallet_connect_v1: WalletConnectVersionedCallbacks,
}
export class KeplrConnector extends WalletConnectConnectorV1<KeplrEvents> {
    private keplrChainsIds: string[] = [] 
    private availableChains: SupportedCoins[] = []
    events: KeplrEvents = {
        keplr_enable_wallet_connect_v1: this.KeplrEnableWallet,
        keplr_get_key_wallet_connect_v1: this.KeplrGetKeyWallet,
        keplr_sign_amino_wallet_connect_v1: function (error: Error | null, payload: any): void {
            throw new Error("Function not implemented.");
        },
        session_request: this.SessionRequest,
        connect: function (error: Error | null, payload: any): void
        {
            // Not used
        },
        disconnect: function (error: Error | null, payload: any): void
        {
            // Not used
        },
        call_request: function (error: Error | null, payload: any): void
        {
            // Not used
        }
    }
    constructor(availableChains: SupportedCoins[], options: WalletConnectOptions)
    {
        super(options)
        this.availableChains = availableChains
    }
    get SupportedChains()
    {
        return this.availableChains
    }
    SessionRequest(error: Error | null, payload: any)
    {
        // Keplr do not uses default session request but the keplr_enable_wallet_connect_v1 custom one
        this.connector?.approveSession({
            chainId: 99999,
            accounts: [],
        })
    }

    KeplrEnableWallet(error: Error | null, payload: any)
    {
        this.keplrChainsIds = payload.params
        console.log(this.keplrChainsIds)

        this.approve(payload, [])
    }

    async KeplrGetKeyWallet(error: Error | null, payload: any)
    {
        const chain = payload.params[0]
        const [pubKey, address] = await Promise.all([this.walletInterface.PubKey(), this.walletInterface.Address(chain)])

        this.approve(payload, [{
			name: this.walletInterface.Name, // profile name (?). It's taken from a meta array so it shouldn't be critic.
			algo: this.walletInterface.Algorithm(), //if ethereum ethsecp256k1 else secp256k1
			pubKey: Buffer.from(pubKey).toString("hex"), //key.pubKey Uint8Array
			address: Buffer.from(pubKey).toString("hex"), //key.address Uint8Array
			bech32Address: address, //See tobech32 function
			isNanoLedger: false, //if ledger true else false
        }])
    }
}