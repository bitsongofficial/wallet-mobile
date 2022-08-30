import { useCallback, useMemo } from "react"
import { StyleSheet, View, Text, TextProps, ListRenderItem } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet"
import { BottomSheetHeader } from "components/moleculs"
import { Input } from "components/atoms"
import { useStore } from "hooks"
import { MockChain } from "stores/MainStore"
import { ListItemChain } from "../atoms"
import { RectButton } from "react-native-gesture-handler"

type Props = {
	searchInput: InputHandler
}

export default observer<Props>(({ searchInput }) => {
	const { chains, setActiveChain } = useStore()

	const filtredChains = useMemo(
		() =>
			searchInput.lowerCaseValue
				? chains.filter((chain) =>
						chain.tokenName //
							.toLowerCase()
							.includes(searchInput.lowerCaseValue),
				  )
				: chains,
		[searchInput.lowerCaseValue],
	)

	const filtredRecent = useMemo(
		() =>
			searchInput.lowerCaseValue
				? // TODO: get Recent
				  chains.filter((chain) =>
						chain.tokenName //
							.toLowerCase()
							.includes(searchInput.lowerCaseValue),
				  )
				: chains,
		[searchInput.lowerCaseValue],
	)

	const keyExtractor = useCallback(({ id }: MockChain) => id, [])

	return (
		<BottomSheetView style={styles.container}>
			<BottomSheetHeader title="Select Chain" style={styles.header} />

			<Input
				bottomsheet
				value={searchInput.value}
				placeholder="Search Tokens"
				onChangeText={searchInput.set}
				style={styles.search}
			/>

			<Caption>Recent</Caption>
			<BottomSheetView style={styles.recentView}>
				<BottomSheetFlatList
					horizontal
					data={filtredRecent}
					contentContainerStyle={styles.recentList}
					keyExtractor={keyExtractor}
					renderItem={({ item }) => (
						<RectButton
							onPress={() => setActiveChain(item)}
							style={{
								marginRight: 13,
							}}
						>
							<View style={styles.recentAvatar} />
						</RectButton>
					)}
				/>
			</BottomSheetView>

			<Caption style={styles.captionChain}>Chain</Caption>
			<BottomSheetFlatList
				data={filtredChains}
				keyExtractor={keyExtractor}
				renderItem={({ item }) => (
					<ListItemChain
						chain={item}
						style={styles.itemChain}
						onPress={setActiveChain}
						//
					/>
				)}
			/>
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 30,
		flex: 1,
		paddingTop: 25,
	},

	// ------ header --------
	header: { marginBottom: 25 },
	search: {
		backgroundColor: COLOR.Dark3,
		marginBottom: 51,
	},

	// -------- Recent ---------
	recentView: {
		height: 70,
		marginBottom: 24,
		marginTop: 9,
	},
	recentList: { alignItems: "center" },
	recentAvatar: {
		width: 48,
		height: 48,
		borderRadius: 48,
		backgroundColor: COLOR.Dark3,
	},

	// ---------- List -------------
	captionChain: { marginBottom: 14 },
	itemChain: {
		marginBottom: 6,
		marginLeft: 8,
		marginRight: 10,
	},

	// --------------
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 15,
		lineHeight: 19,
		color: hexAlpha(COLOR.White, 30),
	},
})

const Caption = (props: TextProps) => <Text {...props} style={[styles.caption, props.style]} />
