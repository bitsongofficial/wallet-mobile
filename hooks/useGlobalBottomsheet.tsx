import { createRef } from "react";
import { makeAutoObservable } from "mobx";
import { BottomSheetProps } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";

class GlobalBottomSheet implements BottomSheetMethods {
  readonly defaultProps: BottomSheetProps = {
    enablePanDownToClose: true,
    snapPoints: ["85%"],
    android_keyboardInputMode: "adjustResize",
    index: -1,
    children: <></>,
  };

  ref = createRef<BottomSheetMethods>();
  props: Partial<BottomSheetProps> = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  tmpClose?: () => void

  setProps(props?: Partial<BottomSheetProps>): void {
    if (props) {
      const onClose = props.onClose;
      props.onClose = () => {
        if (onClose) onClose();
        this.props = this.defaultProps;
      };
    }
    this.props = props || {};
  }

  updProps(props?: Partial<BottomSheetProps>) {
    this.props = { ...this.props, ...props };
  }

  clear() {
    this.props = {};
    this.snapToIndex(-1);
  }

  get children() {
    return this.props.children || this.defaultProps.children;
  }

  openDefault(children: JSX.Element) {
    this.setProps({ children });
    this.expand();
  }

  // ------------ BottomSheetMethods --------------

  collapse() {
    this.ref.current?.collapse();
  }
  close() {
    this.ref.current?.close();
  }
  closeSoft() {
    this.tmpClose = this.props.onClose 
    this.updProps({
      onClose: undefined
    })
    this.close()
  }

  openSoft() {
    this.updProps({
      onClose: this.tmpClose
    })
    this.expand()
  }

  expand() {
    this.ref.current?.expand();
  }

  forceClose() {
    this.ref.current?.forceClose();
  }

  snapToIndex(
    index: number,
    animationConfigs?: WithSpringConfig | WithTimingConfig
  ) {
    this.ref.current?.snapToIndex(index, animationConfigs);
  }

  snapToPosition(
    position: number | string,
    animationConfigs?: WithSpringConfig | WithTimingConfig
  ) {
    this.ref.current?.snapToPosition(position, animationConfigs);
  }
}

const globalBottomsheet = new GlobalBottomSheet();

export default function useGlobalBottomsheet(): GlobalBottomSheet {
  return globalBottomsheet;
}
