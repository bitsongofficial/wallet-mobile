import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import BottomSheetDefault, { BottomSheetProps } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useTheme } from "hooks";
import { observer } from "mobx-react-lite";

type Props = BottomSheetProps;

export default observer(
  forwardRef(function BottomSheet(
    { ...props }: Props,
    ref: React.Ref<BottomSheetMethods>
  ) {
    const theme = useTheme();
    console.log("BottomSheet innerRef ", ref);
    return (
      <BottomSheetDefault
        handleComponent={() => (
          <View style={styles.handleContainer}>
            <View
              style={[styles.handleIndicator, theme.bottomsheet.indicator]}
            />
          </View>
        )}
        backgroundStyle={[styles.background, theme.bottomsheet.background]}
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
