import { Keyboard } from "react-native"
import { gbs } from "modals"
import ConfirmView from "./organisms/ConfirmView"
import { Button, Title } from "components/atoms"

type Props = {
	titleTranslationString?: string,
	onClose?(): void
	onDismiss?(): void
	onConfirm?(): void
	onResult?(res: boolean): void
}

export default async function openConfirm(props: React.PropsWithChildren<Props> = {})
{
	const {
		titleTranslationString,
		onClose,
		onResult,
		onDismiss,
		onConfirm,
		children,
		...otherProps
	} = props
	const status = { done: false }
	const close = () => {
		Keyboard.dismiss()
		onResult && onResult(true)
		gbs.close()
	}

	gbs.backHandler = () => close()

	const confirm = () =>
	{
		status.done = true
		onConfirm && onConfirm()
		onResult && onResult(true)
		close()
	}

	await gbs.setProps({
		snapPoints: ["75%"],
		...otherProps,
		onChange(index) {
			if (index === -1) {
				gbs.removeBackHandler()
				onClose && onClose()
				onDismiss && !status.done && onDismiss()
				onResult && onResult(status.done)
			}
		},
		children: () => <ConfirmView titleTranslationString={titleTranslationString} onPressConfirm={confirm}>
			{children}
		</ConfirmView>,
	})
	requestAnimationFrame(() => gbs.expand())
}