import { createRef } from "react"
import { action, makeAutoObservable, makeObservable, observable } from "mobx"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { WithSpringConfig, WithTimingConfig } from "react-native-reanimated"

export default class GlobalBottomSheet implements BottomSheetMethods {
	readonly defaultProps: BottomSheetProps = {
		enablePanDownToClose: true,
		snapPoints: ["85%"],
		android_keyboardInputMode: "adjustResize",
		index: -1,
		children: <></>,
	}

	ref = createRef<BottomSheetMethods>()
	props: Partial<BottomSheetProps> = {}

	backHandler: (() => boolean | void) | undefined

	removeBackHandler() {
		this.backHandler = undefined
	}

	constructor() {
		makeObservable(this, {
			setProps: action,
			updProps: action,
			clear: action,
			removeBackHandler: action,
			ref: observable,
		}, { autoBind: true })
	}

	setProps(props?: Partial<BottomSheetProps>) {
		this.props = props || {}
	}

	updProps(props?: Partial<BottomSheetProps>) {
		this.props = { ...this.props, ...props }
	}

	clear() {
		this.props = {}
		this.snapToIndex(-1)
	}

	get children() {
		return this.props.children || this.defaultProps.children
	}

	openDefault(children: JSX.Element) {
		this.setProps({ children })
		this.expand()
	}

	// ------------ BottomSheetMethods --------------

	collapse() {
		this.ref.current?.collapse()
	}
	close() {
		this.ref.current?.close()
	}

	expand() {
		this.ref.current?.expand()
	}

	forceClose() {
		this.ref.current?.forceClose()
	}

	snapToIndex(index: number, animationConfigs?: WithSpringConfig | WithTimingConfig) {
		this.ref.current?.snapToIndex(index, animationConfigs)
	}

	snapToPosition(
		position: number | string,
		animationConfigs?: WithSpringConfig | WithTimingConfig,
	) {
		this.ref.current?.snapToPosition(position, animationConfigs)
	}
}
