import { FC, forwardRef, useCallback } from "react"
import { StyleSheet, View } from "react-native"
import { Observer, observer } from "mobx-react-lite"
import {
	BottomSheetModalMethods,
	BottomSheetMethods,
} from "@gorhom/bottom-sheet/lib/typescript/types"
import DefaultBottomSheet, {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal as Default,
	BottomSheetModalProps,
	BottomSheetProps,
} from "@gorhom/bottom-sheet"
import { useTheme } from "hooks"
import { COLOR } from "utils"
import { gav } from "modals"
import { s } from "react-native-size-matters"

type PropsModal = BottomSheetModalProps

export const BottomSheetModal = observer(
	forwardRef(function BottomSheetModal(
		{ backgroundStyle, ...props }: PropsModal,
		ref: React.Ref<BottomSheetModalMethods>,
	) {
		const theme = useTheme()
		return (
			<Default
				handleComponent={() => (
					<View style={styles.handleContainer}>
						<View style={[styles.handleIndicator, theme.bottomsheet.indicator]} />
					</View>
				)}
				backdropComponent={(bProps) => (
					<BottomSheetBackdrop
						{...bProps}
						disappearsOnIndex={-1}
						appearsOnIndex={0}
						style={[{ backgroundColor: COLOR.Dark3 }, bProps.style]}
					/>
				)}
				backgroundStyle={[styles.background, theme.bottomsheet.background, backgroundStyle]}
				{...props}
				ref={ref}
			/>
		)
	}),
)

type Props = BottomSheetProps

export const BottomSheetObserver = observer(
	forwardRef(function BottomSheet(
		{ backgroundStyle, ...props }: Props,
		ref: React.Ref<BottomSheetMethods>,
	) {
		const theme = useTheme()

		const renderBackdrop = useCallback<FC<BottomSheetBackdropProps>>(
			(bProps) => (
				<Observer
					render={() => (
						<BottomSheetBackdrop
							{...bProps}
							disappearsOnIndex={gav.isShow ? 0 : -1}
							appearsOnIndex={gav.isShow ? -1 : 0}
							style={[styles.backdrop, bProps.style]}
						/>
					)}
				/>
			),
			[],
		)

		const handleChange = useCallback((index: number) => {
			index === -1 && gav.close()
			props.onChange && props.onChange(index)
		}, [])

		return (
			<DefaultBottomSheet
				handleComponent={() => (
					<View style={styles.handleContainer}>
						<View style={[styles.handleIndicator, theme.bottomsheet.indicator]} />
					</View>
				)}
				backdropComponent={renderBackdrop}
				backgroundStyle={[styles.background, theme.bottomsheet.background, backgroundStyle]}
				{...props}
				ref={ref}
				onChange={handleChange}
			/>
		)
	}),
)

const styles = StyleSheet.create({
	background: {
		borderTopRightRadius: s(30),
		borderTopLeftRadius: s(30),
	},
	// ------- handle --------
	handleContainer: {
		height: s(30),
		justifyContent: "center",
		alignItems: "center",
	},
	handleIndicator: {
		height: s(3),
		width: s(120),
		borderRadius: s(2),
	},
	backdrop: { backgroundColor: COLOR.Dark3 },
})
