import { useCallback, useEffect, useMemo, useRef } from "react"
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton, Swipeable } from "react-native-gesture-handler"
import { COLOR, hexAlpha } from "utils"
import { SwipeActions } from "../atoms"
import { Icon2 } from "components/atoms"
import { Contact } from "stores/ContactsStore"
import { s } from "react-native-size-matters"

type Props = {
	value: Contact
	onPress?(person: Contact): void
	onPressStar(person: Contact): void
	onPressEdit?(person: Contact): void
	onPressDelete(person: Contact): void
	mapItemsRef: Map<Contact, React.RefObject<Swipeable>>
	style?: StyleProp<ViewStyle>
	wrapper?: number
}

export default ({
	value,
	onPress,
	onPressDelete,
	onPressEdit,
	onPressStar,
	mapItemsRef,
	style,
	wrapper,
}: Props) => {
	const handlePress = useCallback(() => onPress && onPress(value), [onPress, value])

	const ref = useRef<Swipeable>(null)

	useEffect(() => {
		mapItemsRef.set(value, ref)
	}, [value, ref])

	const closeOther = useCallback(
		() => mapItemsRef.forEach((ref, key) => key.address !== value.address && ref.current?.close()),
		[value, mapItemsRef],
	)

	const wrapperStyle = useMemo<ViewStyle>(() => ({ paddingHorizontal: wrapper || 26 }), [wrapper])
	const actionStyle = useMemo<ViewStyle>(() => ({ marginRight: wrapper || 26 }), [wrapper])

	const renderRightActions = () => (
		<SwipeActions
			item={value}
			onPressEdit={onPressEdit}
			onPressTrash={onPressDelete}
			style={actionStyle}
		/>
	)

	return (
		<Swipeable
			ref={ref}
			onSwipeableRightWillOpen={closeOther}
			renderRightActions={renderRightActions}
		>
			<View style={wrapperStyle}>
				<RectButton onPress={handlePress} style={styles.buttonContainer}>
					<View style={[styles.container, style]}>
						<Image source={{ uri: value.avatar }} style={styles.avatar} />
						<View style={{ flex: 1 }}>
							<Text style={styles.name}>{value.name}</Text>
							<Text style={styles.wallet}>{value.address}</Text>
						</View>
						<RectButton style={styles.buttonStar} onPress={() => onPressStar(value)}>
							<Icon2
								name="star"
								size={20}
								stroke={hexAlpha(COLOR.White, 30)}
								fill={value.starred ? hexAlpha(COLOR.White, 30) : undefined}
							/>
						</RectButton>
					</View>
				</RectButton>
			</View>
		</Swipeable>
	)
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		backgroundColor: hexAlpha(COLOR.Lavender, 16),
		borderRadius: s(22),
		paddingVertical: s(22),
		paddingHorizontal: s(24),

		flexDirection: "row",
	},
	active: {
		padding: s(2),
		borderRadius: s(20),
		justifyContent: "center",
	},

	avatar: {
		width: s(32),
		height: s(32),
		borderRadius: s(32),

		marginRight: s(16),
	},

	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		color: COLOR.White,
	},
	wallet: {
		//
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(12),
		lineHeight: s(15),
		color: hexAlpha(COLOR.White, 60),
	},

	buttonContainer: {
		borderRadius: s(22),
	},
	buttonStar: {
		borderRadius: s(22),
		alignItems: "center",
		justifyContent: "center",
		padding: s(5),
	},
})
