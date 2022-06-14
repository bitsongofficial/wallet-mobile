import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
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

type PropsModal = BottomSheetModalProps;

export const BottomSheetModal = observer(
  forwardRef(function BottomSheetModal(
    { backgroundStyle, ...props }: PropsModal,
    ref: React.Ref<BottomSheetModalMethods>
  ) {
    const theme = useTheme();
    return (
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
        ref={ref}
      />
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
    return (
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
        ref={ref}
      />
    );
  })
);

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
