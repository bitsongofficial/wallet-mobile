import { StdSignDoc } from "@cosmjs-rn/amino";
import { SupportedCoins } from "constants/Coins";
import { chainIdToChain } from "core/utils/Coin";
import * as CryptoJS from "crypto-js";
import { WalletConnectBaseEvents, WalletConnectCallback, WalletConnectConnectorV1, WalletConnectOptions, WalletConnectVersionedCallbacks } from "./ConnectorV1";

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
        if(chain)
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
        }
        else
        {
            this.reject(payload, new Error("chain id invalid"))
        }
    }
    
    async KeplrSign(error: Error | null, payload: any)
    {
        const [chainId, signer, signDoc, signOptions] = payload.params as [string, string, StdSignDoc, KeplrSignOptions]

        const [identifier, version] = chainId.split(KeplrConnector.VersionFormatRegExp)
        const chain = chainIdToChain(identifier)
        if(chain)
        {
            const signedDoc = await this.walletInterface.Sign(chain, signDoc, signer)
            if(signedDoc)
            {
                this.approve(payload, [
                    signedDoc
                ])
                return
            }
            console.log(signedDoc)
        }
        this.reject(payload, new Error("Chain not supported"))
    }
}