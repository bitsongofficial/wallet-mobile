import { InteractionManager, Keyboard } from "react-native"
import ConfirmView from "./organisms/ConfirmView"
import { gbs } from "modals"
import { ReactNode } from "react"

type Props = {
	titleTranslationString?: string,
	header?: ReactNode,
	onDismiss?(): void
	onConfirm?(): void
}

export default async function openConfirm(props: React.PropsWithChildren<Props> = {})
{
	const {
		titleTranslationString,
		onDismiss,
		onConfirm,
		header,
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

	const onClose = () =>
	{
		gbs.removeBackHandler()
		if(onDismiss && (status.done === false)) onDismiss()
	}

	const dismiss = () =>
	{
		onDismiss && onDismiss()
		close()
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
			children: () => 
				<ConfirmView
					header={header}
					titleTranslationString={titleTranslationString}
					onPressConfirm={confirm}
					onPressReject={dismiss}>
					{children}
				</ConfirmView>,
		})
		gbs.expand()
	})
}