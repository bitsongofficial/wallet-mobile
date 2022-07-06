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

  setProps(props?: Partial<BottomSheetProps>) {
    this.props = props || {};
  }

  openDefault(children: JSX.Element) {
    this.setProps({ children });
    this.snapToIndex(0);
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

export default function useGlobalBottomsheet() {
  return globalBottomsheet;
}
