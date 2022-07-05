import { BottomSheetProps } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { makeAutoObservable, toJS } from "mobx";
import { createRef } from "react";
import { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";

class GlobalBottomSheet implements BottomSheetMethods {
  readonly defaultProps: BottomSheetProps = {
    enablePanDownToClose: true,
    snapPoints: ["15%", "50%", "85%"],
    android_keyboardInputMode: "adjustResize",
    index: -1,
    children: <></>,
  };

  ref = createRef<BottomSheetMethods>();
  props: BottomSheetProps | {} = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async setProps(props?: Partial<BottomSheetProps>): Promise<void> {
    if(props)
    {
      const onClose = props.onClose
      props.onClose = () =>
      {
        if(onClose) onClose()
        this.props = this.defaultProps
      }
    }
    this.props = props || {};
  }

  async openDefault(children: JSX.Element) {
    await this.setProps({ children });
    this.expand();
  }

  // ------------ BottomSheetMethods --------------

  collapse() {
    this.ref.current?.collapse();
  }
  close() {
    this.ref.current?.close();
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
