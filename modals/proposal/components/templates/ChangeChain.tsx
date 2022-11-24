import { useCallback, useMemo } from "react"
import { StyleSheet, Text, TextProps, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet"
import { BottomSheetHeader } from "components/moleculs"
import { Input } from "components/atoms"
import { useStore } from "hooks"
import { ListItemChain } from "../atoms"
import { RectButton } from "react-native-gesture-handler"
import {  getAssetIcon, getAssetName } from "core/utils/Coin"
import { SupportedCoins } from "constants/Coins"
import { s, vs } from "react-native-size-matters"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = {
	searchInput: InputHandler
	setActiveChain?: (coin: SupportedCoins) => any
}

export default observer<Props>(({ searchInput, setActiveChain }) => {
	const { proposals, chains: chainStore } = useStore()
	const chains: SupportedCoins[] = chainStore.enabledCoins

	const filtredChains = useMemo(
		() =>
			searchInput.lowerCaseValue
				? chains.filter((chain) =>
						getAssetName(chain) //
							.toLowerCase()
							.includes(searchInput.lowerCaseValue),
				  )
				: chains,
		[searchInput.lowerCaseValue],
	)

	const filteredRecent = useMemo(
		() =>
			searchInput.lowerCaseValue
				? // TODO: get Recent
				  proposals.recentChains.filter((chain) =>
						getAssetName(chain) //
							.toLowerCase()
							.includes(searchInput.lowerCaseValue),
				  )
				: proposals.recentChains,
		[searchInput.lowerCaseValue, proposals.recentChains],
	)

	const keyExtractor = useCallback((chain: SupportedCoins) => chain, [])

	return (
		<BottomSheetView style={styles.container}>
			<BottomSheetHeader title="Select Chain" style={styles.header} />

			<Input
				bottomsheet
				value={searchInput.value}
				placeholder="Search Tokens"
				onChangeText={searchInput.set}
				style={styles.search}
				inputStyle={styles.input}
			/>

			{proposals.recentChains.length > 0 && (
				<>
					<Caption>Recent</Caption>
					<BottomSheetView style={styles.recentView}>
						<BottomSheetFlatList
							horizontal
							data={filteredRecent}
							contentContainerStyle={styles.recentList}
							keyExtractor={keyExtractor}
							renderItem={({ item }) => (
								<RectButton
									onPress={() => {
										if (setActiveChain) setActiveChain(item)
									}}
									style={{
										marginRight: 13,
									}}
								>
									<Image style={styles.recentAvatar} source={{ uri: getAssetIcon(item) }} />
								</RectButton>
							)}
						/>
					</BottomSheetView>
				</>
			)}

			<Caption style={styles.captionChain}>Chain</Caption>
			<BottomSheetFlatList
				data={filtredChains}
				keyExtractor={keyExtractor}
				renderItem={({ item }) => (
					<ListItemChain
						chain={item}
						style={styles.itemChain}
						onPress={() => {
							if (setActiveChain) setActiveChain(item)
						}}
					/>
				)}
			/>
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
		flex: 1,
		paddingTop: s(25),
	},

	// ------ header --------
	header: { marginBottom: vs(25) },
	search: {
		backgroundColor: COLOR.Dark3,
		marginBottom: vs(51),
	},
	input: {
		height: s(52),
	},

	// -------- Recent ---------
	recentView: {
		height: vs(70),
		marginBottom: vs(24),
		marginTop: vs(9),
	},
	recentList: { alignItems: "center" },
	recentAvatar: {
		width: s(48),
		height: s(48),
		borderRadius: s(48),
		backgroundColor: COLOR.Dark3,
	},

	// ---------- List -------------
	captionChain: { marginBottom: vs(14) },
	itemChain: {
		marginBottom: vs(6),
		marginLeft: s(8),
		marginRight: s(10),
	},

	// --------------
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(15),
		lineHeight: s(19),
		color: hexAlpha(COLOR.White, 30),
	},
})

const Caption = (props: TextProps) => <Text {...props} style={[styles.caption, props.style]} />
