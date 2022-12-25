import { StdFee, StdSignDoc, AminoMsg } from "@cosmjs-rn/amino";
import { SupportedCoins } from "constants/Coins";
import { chainIdToChain } from "core/utils/Coin";
import * as CryptoJS from "crypto-js";
import openConfirm from "modals/general/openConfirm";
import { WalletConnectBaseEvents, WalletConnectConnectorV1, WalletConnectOptions, WalletConnectVersionedCallbacks } from "./ConnectorV1";
import KeplrSignRecap from "modals/walletconnect/keplr/KeplrSignRecap";
import openModal from "modals/general/openModal";
import SignMessageError from "modals/walletconnect/SignMessageError";
import ContinueOnDesktop from "modals/walletconnect/ContinueOnDesktop";
import { EncodeObject } from "@cosmjs-rn/proto-signing";
import JSONTree from "react-native-json-tree";
import SignArbitraryRecap from "modals/walletconnect/bitsongjs/SignArbitraryRecap";

export interface BitsongEvents extends WalletConnectBaseEvents {
    sign: WalletConnectVersionedCallbacks,
    signAndBroadcast: WalletConnectVersionedCallbacks,
    signArbitrary: WalletConnectVersionedCallbacks,
}
export class BitsongJSConnector extends WalletConnectConnectorV1<BitsongEvents> {
    static readonly VersionFormatRegExp = /(.+)-([\d]+)/
    private availableChains: SupportedCoins[] = []
    events: BitsongEvents = {
        sign: this.Sign.bind(this),
        signAndBroadcast: this.SignAndBroadCast.bind(this),
        signArbitrary: this.SignArbitrary.bind(this),
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
        },
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
        console.log(this.connector, {
            chainId: 1,
            accounts: [
                this.walletInterface.Name
            ],
        })
        this.connector?.approveSession({
            chainId: 1,
            accounts: [
                this.walletInterface.Name
            ],
        })
    }

    async Sign(error: Error | null, payload: any)
    {
        const {chain, data} = payload.params[0] as {chain: string, data: {signerAddress: string, signDoc: StdSignDoc}}
        const {signDoc, signerAddress} = data
        const snapPoints = ["70%"]
        if(chain)
        {
            openConfirm({
                children: <KeplrSignRecap messages={[...signDoc.msgs]}></KeplrSignRecap>,
                onConfirm: async () =>
                {
                    try
                    {
                        const signedDoc = await this.walletInterface.Sign(chain as SupportedCoins, signDoc, signerAddress)
                        if(signedDoc)
                        {
                            this.approve(payload, [
                                signedDoc
                            ])
                            openModal({
                                children: <ContinueOnDesktop></ContinueOnDesktop>,
                                snapPoints,
                            })
                            return
                        }
                        else
                        {
                            throw "Sign failed exception"
                        }
                    }
                    catch(e)
                    {
                        console.error("Catched", e)
                        openModal({
                            children: <SignMessageError></SignMessageError>,
                            snapPoints,
                        })
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

    async SignAndBroadCast(error: Error | null, payload: any)
    {
        const {chain, data} = payload.params[0] as {chain: string, data: {signerAddress: string, messages: EncodeObject[], fee: number | StdFee | "auto", memo: string}}
        const {messages, signerAddress, fee, memo} = data
        const snapPoints = ["70%"]
        if(chain)
        {
            openConfirm({
                children: <KeplrSignRecap messages={[...messages.map(e => ({type: e.typeUrl, value: e.value}))]}></KeplrSignRecap>,
                onConfirm: async () =>
                {
                    try
                    {
                        const signedDoc = await this.walletInterface.SignAndBroadCast(chain as SupportedCoins, messages, fee, memo, signerAddress)
                        if(signedDoc)
                        {
                            this.approve(payload, [
                                signedDoc
                            ])
                            openModal({
                                children: <ContinueOnDesktop></ContinueOnDesktop>,
                                snapPoints,
                            })
                            return
                        }
                        else
                        {
                            throw "Sign failed exception"
                        }
                    }
                    catch(e)
                    {
                        console.error("Catched", e)
                        openModal({
                            children: <SignMessageError></SignMessageError>,
                            snapPoints,
                        })
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
    
    async SignArbitrary(error: Error | null, payload: any)
    {
        const {chain, data} = payload.params[0] as {chain: string, data: {signerAddress: string, payload: any}}
        const {payload: signerArbitraryPayload, signerAddress} = data
        const snapPoints = ["70%"]
        if(chain)
        {
            openConfirm({
                children: <SignArbitraryRecap data={signerArbitraryPayload}></SignArbitraryRecap>,
                onConfirm: async () =>
                {
                    try
                    {
                        const stdSignature = await this.walletInterface.SignArbitrary(chain, signerArbitraryPayload, signerAddress)
                        if(stdSignature)
                        {
                            this.approve(payload, [
                                stdSignature
                            ])
                            openModal({
                                children: <ContinueOnDesktop></ContinueOnDesktop>,
                                snapPoints,
                            })
                            return
                        }
                        else
                        {
                            throw "Sign failed exception"
                        }
                    }
                    catch(e)
                    {
                        console.error("Catched", e)
                        openModal({
                            children: <SignMessageError></SignMessageError>,
                            snapPoints,
                        })
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