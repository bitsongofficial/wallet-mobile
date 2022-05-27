import { StyleSheet, TextInputProps, View } from "react-native";
import React from "react";
import { COLOR, hexAlpha } from "utils";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Icon2 } from "components/atoms";

type SearchProps = TextInputProps;

export default ({ style, ...props }: SearchProps) => (
  <View style={[styles.container, style]}>
    <BottomSheetTextInput
      style={styles.input}
      placeholderTextColor={hexAlpha(COLOR.White, 50)}
      placeholder="Cerca Valuta"
      {...props}
    />
    <View style={styles.iconContainer}>
      <Icon2 name="" size={21} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: hexAlpha(COLOR.Lavender, 10),
    borderRadius: 20,
    height: 62,
    flexDirection: "row",
    paddingLeft: 25,
  },
  input: {
    flex: 1,
    color: COLOR.White,
  },
  iconContainer: {
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
