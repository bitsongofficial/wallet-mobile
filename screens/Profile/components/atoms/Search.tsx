import { StyleSheet, TextInputProps, View } from "react-native";
import { COLOR, hexAlpha } from "utils";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Icon2 } from "components/atoms";

type SearchProps = TextInputProps & {
  loupe?: boolean;
};

export default ({ style, loupe = true, ...props }: SearchProps) => (
  <View style={[styles.container, style]}>
    <BottomSheetTextInput
      style={styles.input}
      placeholderTextColor={hexAlpha(COLOR.White, 50)}
      {...props}
    />
    {loupe && (
      <View style={styles.iconContainer}>
        <Icon2
          name="magnifying_glass"
          stroke={hexAlpha(COLOR.White, 20)}
          size={21}
        />
      </View>
    )}
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
