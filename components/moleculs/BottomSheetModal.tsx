import { FC, forwardRef, useCallback } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
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
				<BottomSheetBackdrop
					{...bProps}
					disappearsOnIndex={-1}
					appearsOnIndex={0}
					style={[styles.backdrop, bProps.style]}
				/>
			),
			[],
		)

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
			/>
		)
	}),
)

const styles = StyleSheet.create({
	background: {
		borderTopRightRadius: 30,
		borderTopLeftRadius: 30,
	},
	// ------- handle --------
	handleContainer: {
		height: 30,
		justifyContent: "center",
		alignItems: "center",
	},
	handleIndicator: {
		height: 3,
		width: 120,
		borderRadius: 2,
	},
	backdrop: { backgroundColor: COLOR.Dark3 },
})
