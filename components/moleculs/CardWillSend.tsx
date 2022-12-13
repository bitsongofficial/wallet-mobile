import { useEffect, useMemo, useState } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, Icon2 } from "components/atoms"
import { useStore, useTheme } from "hooks"
import { COLOR, hexAlpha } from "utils"
import { ICoin, IPerson } from "classes/types"
import { observer } from "mobx-react-lite"
import { useCallback } from "react"
import { Contact } from "stores/ContactsStore"
import { s } from "react-native-size-matters"
import { useTranslation } from "react-i18next"
import { Asset } from "stores/models/Asset"
import { Chain } from "stores/models/Chain"
import { SupportedCoins } from "constants/Coins"

type Props = {
	/** How many coin we will send */
	amount: string
	/** Account details from which we send */
	asset: Asset | null
	chain?: Chain
	/** The address we ship to */
	address: string

	onPressUp(): void
	style?: StyleProp<ViewStyle>
}

export default observer(function CardWillSend({
	address,
	amount,
	asset,
	chain,

	onPressUp,
	style,
}: Props) {
	const { t } = useTranslation()
	const theme = useTheme()
	const { settings, contacts, coin, wallet, chains } = useStore()
	
	const [userAddressForChain, setUserAddressForChain] = useState<string>()
	const receiver: Contact | undefined = contacts.contacts.find((c) => c.address === address)

	const addContact = useCallback(() => {
		contacts.addContact({
			name: "New contact",
			address,
		})
	}, [address])

	const coinsValue = parseFloat(amount)
	const dollars = useMemo(() => (asset ? coin.fromAssetBalanceToFiat({balance: parseFloat(amount), denom: asset.denom, chain: asset.chainId}) : 0), [amount])
	const coinsIntegerValue = Math.floor(coinsValue)
	const coinsDecimalValue = coinsValue - coinsIntegerValue

	const shortAddress = `${address.substring(0, 10)}..${address.slice(-7)}`
	const shortFrom = userAddressForChain ? `${userAddressForChain.substring(0, 10)}..${userAddressForChain.slice(-7)}` : ""
	
	useEffect(() =>
	{
		if(chain)
		{
			const chainKey = chains.ChainKey(chain.id);

			(async () =>
			{
				if(chainKey) setUserAddressForChain(await wallet.activeAddress(chainKey as SupportedCoins))
			})()
		}
	}, [wallet.activeProfile, chains, chain])

	return (
		<View style={[styles.container, style]}>
			<View style={styles.title}>
				<Text style={[styles.text, styles.titleText, theme.text.colorText]}>
					{t("YouAreSending")}</Text>
				<TouchableOpacity onPress={onPressUp}>
					<Icon2 name="arrow_up" size={18} stroke={COLOR.Marengo} />
				</TouchableOpacity>
			</View>

			<Text style={[styles.transferAmount, theme.text.primary]}>
				{coinsIntegerValue}
				{coinsDecimalValue != 0 && <Text style={styles.transferAmountDecimal}>.{coinsDecimalValue.toString().substring(2)}</Text>}
				{asset && <Text style={styles.coinName}> {asset.tag.toUpperCase()}</Text>}
			</Text>

			<Text style={[styles.fiatText]}>
				{dollars} {settings.prettyCurrency?.symbol}
			</Text>

			<View style={styles.row}>
				<Text style={[styles.text, styles.w66, theme.text.colorText]}>{t("From")}</Text>
				<Text style={[styles.text, theme.text.primary]}>{shortFrom}</Text>
			</View>

			<View style={styles.row}>
				<Text style={[styles.text, styles.w30, theme.text.colorText]}>{t("To")}</Text>
				<Text style={[styles.text, theme.text.primary]}>{shortAddress}</Text>
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		backgroundColor: COLOR.Dark3,
		padding: 27,
		paddingTop: 33,
	},
	w66: { width: 66 },
	w30: { width: 30 },
	title: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
	},
	fiatText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 18,
		color: hexAlpha(COLOR.White, 50),
	},
	titleText: {
		fontWeight: "400",
		fontSize: 16,
		lineHeight: 20,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 13,
	},
	transferAmount: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 36,
		lineHeight: 53,

		marginTop: 4,
	},
	transferAmountDecimal: {
		fontSize: s(15),
	},
	coinName: {
		fontSize: s(20),
	},
	avatar: {
		width: 20,
		height: 20,
		borderRadius: 20,
		marginRight: 12,

		backgroundColor: "grey",
	},
	buttonAdd: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
})
