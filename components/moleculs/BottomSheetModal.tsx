import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import {
  BottomSheetModalMethods,
  BottomSheetMethods,
} from "@gorhom/bottom-sheet/lib/typescript/types";
import DefaultBottomSheet, {
  BottomSheetModal as Default,
  BottomSheetModalProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import { useTheme } from "hooks";
import { Backdrop } from "components/atoms";

type PropsModal = BottomSheetModalProps;

export const BottomSheetModal = observer(
  forwardRef(function BottomSheetModal(
    { backgroundStyle, ...props }: PropsModal,
    ref: React.Ref<BottomSheetModalMethods>
  ) {
    const theme = useTheme();
    const [isOpen, handleAnimate] = useBackdrop(props.onAnimate);

    useBottomSheetBackButton(isOpen);

    return (
      <>
        {isOpen && <Backdrop />}
        <Default
          handleComponent={() => (
            <View style={styles.handleContainer}>
              <View
                style={[styles.handleIndicator, theme.bottomsheet.indicator]}
              />
            </View>
          )}
          backgroundStyle={[
            styles.background,
            theme.bottomsheet.background,
            backgroundStyle,
          ]}
          {...props}
          onAnimate={handleAnimate}
          ref={ref}
        />
      </>
    );
  })
);

type Props = BottomSheetProps;

export const BottomSheet = observer(
  forwardRef(function BottomSheet(
    { backgroundStyle, ...props }: Props,
    ref: React.Ref<BottomSheetMethods>
  ) {
    const theme = useTheme();

    const [isOpen, handleAnimate] = useBackdrop(props.onAnimate);

    useBottomSheetBackButton(isOpen);

    return (
      <>
        {/* {isOpen && <Backdrop />} */}

        <DefaultBottomSheet
          handleComponent={() => (
            <View style={styles.handleContainer}>
              <View
                style={[styles.handleIndicator, theme.bottomsheet.indicator]}
              />
            </View>
          )}
          backgroundStyle={[
            styles.background,
            theme.bottomsheet.background,
            backgroundStyle,
          ]}
          {...props}
          onAnimate={handleAnimate}
          ref={ref}
        />
      </>
    );
  })
);

function useBackdrop(onAnimate: BottomSheetProps["onAnimate"]) {
  const [isOpen, setOpen] = useState(false);

  const toggleBackdrop = useCallback<
    NonNullable<BottomSheetProps["onAnimate"]>
  >((_, to) => setOpen(!to), []);

  const handleAnimate = useCallback<NonNullable<BottomSheetProps["onAnimate"]>>(
    (...args) => {
      toggleBackdrop(...args);
      onAnimate && onAnimate(...args);
    },
    [onAnimate]
  );

  return [isOpen, handleAnimate] as const;
}

function useBottomSheetBackButton(isOpen: boolean | undefined) {
  useEffect(() => {
    if (isOpen) {
      const handler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );
      return () => handler.remove();
    }
  }, [isOpen]);
}

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
});
