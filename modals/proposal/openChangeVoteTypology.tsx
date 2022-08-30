import { gbs } from "modals"
import { ChangeVoteTypology } from "./components/templates"
import { VoteTypology } from "./components/moleculs"

type Options = {
	typology: VoteTypology
	onChange?(typology: VoteTypology): void
	onClose?(): void
}

export default async function openChangeChain(options: Options) {
	const handleChangeTypology = (typology: VoteTypology) => {
		gbs.close()
		options.onChange && options.onChange(typology)
	}

	const open = async () => {
		gbs.backHandler = () => {
			gbs.close()
		}
		await gbs.setProps({
			snapPoints: [350],
			enableContentPanningGesture: false,
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					options.onClose && options.onClose()
				}
			},
			children: () => (
				<ChangeVoteTypology typology={options.typology} onPress={handleChangeTypology} />
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
