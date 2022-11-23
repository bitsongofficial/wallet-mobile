import { InteractionManager, Keyboard } from "react-native"
import ConfirmView from "./organisms/ConfirmView"
import { gbs } from "modals"

type Props = {
	titleTranslationString?: string,
	onDismiss?(): void
	onConfirm?(): void
}

export default async function openConfirm(props: React.PropsWithChildren<Props> = {})
{
	const {
		titleTranslationString,
		onDismiss,
		onConfirm,
		children,
		...otherProps
	} = props
	const status = { done: false }
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	gbs.backHandler = () => close()

	const confirm = () =>
	{
		status.done = true
		onConfirm && onConfirm()
		close()
	}
	() => gbs.close()

	const onClose = () =>
	{
		gbs.removeBackHandler()
		if(onDismiss && (status.done === false)) onDismiss()
	}

	InteractionManager.runAfterInteractions(() => {
		gbs.setProps({
			snapPoints: ["75%"],
			...otherProps,
			onClose,
			onChange: (index) =>
			{
				if(index < 0) onClose()
			},
			children: () => <ConfirmView titleTranslationString={titleTranslationString} onPressConfirm={confirm}>
				{children}
			</ConfirmView>,
		})
		gbs.expand()
	})
}