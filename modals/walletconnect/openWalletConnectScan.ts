import { navigationRef } from "navigation/utils"
import { Connectors } from "stores/DappConnectionStore"
import { store } from "stores/Store"
import openSelectConnector from "./openSelectConnector"

export function openWalletConnectScan()
{
	openSelectConnector((connector: Connectors) =>
	{
		navigationRef.current?.navigate("ScannerQR",
		{
			onBarCodeScanned: (uri: string) => {
				try {
					if (uri.startsWith("wc"))
					{
						store.dapp.connect(uri, connector)
					}
				} catch (e) {
					console.error("Catched", e)
				}
			},
		})
	})
}