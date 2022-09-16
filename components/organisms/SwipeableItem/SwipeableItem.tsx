import { useCallback, useEffect, useMemo, useRef } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton, Swipeable } from "react-native-gesture-handler"
import { COLOR, hexAlpha } from "utils"
import { Icon2 } from "components/atoms"
import SwipeActions from "./SwipeActions"
import { ms, s } from "react-native-size-matters"

type ID = string

type Props = {
	id: ID // for closeOther
	name: string
	date: string
	onPress(id: ID): void
	onPressDelete(id: ID): void
	edited?: boolean
	onPressEdit?(id: ID): void
	mapItemsRef: Map<ID, React.RefObject<Swipeable>>
	style?: StyleProp<ViewStyle>
	wrapper?: number
}

export default ({
	id,
	date,
	name,
	onPress,
	onPressDelete,
	edited,
	onPressEdit,
	mapItemsRef,
	style,
	wrapper,
}: Props) => {
	const handlePress = useCallback(() => onPress(id), [onPress, id])

	const ref = useRef<Swipeable>(null)

	useEffect(() => {
		mapItemsRef.set(id, ref)
	}, [id, ref])

	const closeOther = useCallback(
		() => mapItemsRef.forEach((ref, key) => key !== id && ref.current?.close()),
		[id, mapItemsRef],
	)

	const wrapperStyle = useMemo<ViewStyle>(() => ({ paddingHorizontal: wrapper || 26 }), [wrapper])
	const actionStyle = useMemo<ViewStyle>(
		() => ({ marginRight: wrapper || 26, width: s(50) }),
		[wrapper],
	)

	const renderRightActions = () => (
		<SwipeActions
			id={id}
			edited={edited}
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
				<View style={[styles.container, style]}>
					<RectButton onPress={handlePress}>
						<View style={styles.inner}>
							<Icon2
								name="link_simple_horizontal"
								size={24}
								style={styles.icon}
								stroke={COLOR.AbsoluteBlack}
							/>
							<View style={styles.text}>
								<Text style={styles.name}>{name}</Text>
								<Text style={styles.date}>{date}</Text>
							</View>
						</View>
					</RectButton>
				</View>
			</View>
		</Swipeable>
	)
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		borderRadius: ms(22, 1.5),
	},
	active: {
		padding: ms(2, 1.5),
		borderRadius: ms(20, 1.5),
		justifyContent: "center",
	},
	not_active: {
		padding: ms(1, 1.5),
		borderRadius: ms(20, 1.5),
		justifyContent: "center",
	},

	inner: {
		height: ms(65, 1.5),
		paddingHorizontal: ms(21, 1.5),
		alignItems: "center",
		flexDirection: "row",
		backgroundColor: "#5a6de5",
		borderRadius: ms(20, 1.5),
	},

	icon: {
		marginRight: ms(14, 1.5),
	},

	text: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		justifyContent: "space-between",
	},

	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: ms(15, 1.5),
		lineHeight: ms(19, 1.5),
		color: COLOR.White,
	},

	date: {
		// Apr 12, 10:34 AM
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: ms(12, 1.5),
		lineHeight: ms(15, 1.5),

		color: hexAlpha(COLOR.White, 50),
	},

	name_active: {
		color: COLOR.White,
	},
})
