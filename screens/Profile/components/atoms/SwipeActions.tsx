import { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Button, Icon2 } from "components/atoms";
import { COLOR, hexAlpha } from "utils";
import { Wallet } from "classes";

type Props = {
  wallet: Wallet;
  onPressEdit?(wallet: Wallet): void;
  onPressTrash(wallet: Wallet): void;
  style?: StyleProp<ViewStyle>;
  edited?: boolean;
};

export default memo(
  ({ onPressEdit, onPressTrash, wallet, style, edited = true }: Props) => (
    <View style={[styles.container, style]}>
      {edited && (
        <Button
          text="Edit"
          mode="fill"
          style={styles.button}
          onPress={() => onPressEdit && onPressEdit(wallet)}
          contentContainerStyle={styles.buttonContent}
        />
      )}
      <RectButton onPress={() => onPressTrash(wallet)}>
        <Icon2 size={24} name="trash" stroke={hexAlpha(COLOR.White, 30)} />
      </RectButton>
    </View>
  )
);

const styles = StyleSheet.create({
  container: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
  },

  button: {
    marginRight: 15,
  },
  buttonContent: {
    backgroundColor: hexAlpha(COLOR.Lavender, 10),
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
