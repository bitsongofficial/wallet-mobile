import { StdSignDoc } from "@cosmjs-rn/amino";
import { SupportedCoins } from "constants/Coins";
import { chainIdToChain } from "core/utils/Coin";
import * as CryptoJS from "crypto-js";
import openConfirm from "modals/general/openConfirm";
import { askPin } from "navigation/AskPin";
import { ListItem } from "components/moleculs"
import { WalletConnectBaseEvents, WalletConnectCallback, WalletConnectConnectorV1, WalletConnectOptions, WalletConnectVersionedCallbacks } from "./ConnectorV1";
import { aminoTypePrettyName } from "core/coin/cosmos/operations/utils";
import KeplrConfirmDescription from "modals/walletconnect/keplr/KeplrConfirmDescription";
import KeplrSignRecap from "modals/walletconnect/keplr/KeplrSignRecap";

export interface KeplrEvents extends WalletConnectBaseEvents {
    keplr_enable_wallet_connect_v1: WalletConnectVersionedCallbacks,
    keplr_get_key_wallet_connect_v1: WalletConnectVersionedCallbacks,
    keplr_sign_amino_wallet_connect_v1: WalletConnectVersionedCallbacks,
}
export class KeplrConnector extends WalletConnectConnectorV1<KeplrEvents> {
    static readonly VersionFormatRegExp = /(.+)-([\d]+)/
    private keplrChainsIds: string[] = [] 
    private availableChains: SupportedCoins[] = []
    events: KeplrEvents = {
        keplr_enable_wallet_connect_v1: this.KeplrEnableWallet.bind(this),
        keplr_get_key_wallet_connect_v1: this.KeplrGetKeyWallet.bind(this),
        keplr_sign_amino_wallet_connect_v1: this.KeplrSign.bind(this),
        session_request: this.SessionRequest.bind(this),
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

    private pubKeyToAddress(pubKey: Uint8Array)
    {
        let hash = CryptoJS.SHA256(
            CryptoJS.lib.WordArray.create(pubKey as any)
          ).toString();
          hash = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(hash)).toString();
      
          return new Uint8Array(Buffer.from(hash, "hex"))
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
        const chainId = payload.params[0]
        const chain = chainIdToChain(chainId)
        const profileName = this.walletInterface.Name
        if(chain)
        {
            openConfirm({
                onConfirm: async () =>
                {
                        const [pubKey, address] = await Promise.all([this.walletInterface.PubKey(chain), this.walletInterface.Address(chain)])
                        const res = {
                            name: this.walletInterface.Name,
                            algo: this.walletInterface.Algorithm(),
                            pubKey: Buffer.from(pubKey).toString("hex"),
                            address: Buffer.from(this.pubKeyToAddress(pubKey)).toString("hex"),
                            bech32Address: address,
                            isNanoLedger: false,
                        }
                        this.approve(payload, [res])

                },
                onDismiss: () =>
                {
                    this.reject(payload, new Error("User rejected permission"))
                },
                children: <KeplrConfirmDescription profile={profileName}></KeplrConfirmDescription>
            })
        }
        else
        {
            this.reject(payload, new Error("Chain id invalid"))
        }
    }
    
    async KeplrSign(error: Error | null, payload: any)
    {
        const [chainId, signer, signDoc, signOptions] = payload.params as [string, string, StdSignDoc, KeplrSignOptions]

        const [identifier, version] = chainId.split(KeplrConnector.VersionFormatRegExp)/* 
        const identifier = chainId
        const version = 1
        console.log(chainId, identifier, version) */
        const chain = chainIdToChain(chainId)
        if(chain)
        {
            openConfirm({
                children: <KeplrSignRecap messages={[...signDoc.msgs]}></KeplrSignRecap>,
                onConfirm: async () =>
                {
                    const signedDoc = await this.walletInterface.Sign(chain, signDoc, signer)
                    if(signedDoc)
                    {
                        this.approve(payload, [
                            signedDoc
                        ])
                        return
                    }
                },
                onDismiss: () =>
                {
                    this.reject(payload, new Error("User rejected permission"))
                }
            })

        }
        else
        {
            this.reject(payload, new Error("Chain not supported"))
        }
    }
}