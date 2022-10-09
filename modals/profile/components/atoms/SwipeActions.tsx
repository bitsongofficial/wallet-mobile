import { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Button, Icon2 } from "components/atoms";
import { COLOR, hexAlpha } from "utils";
import { ProfileWallets } from "stores/WalletStore";
import { useTranslation } from "react-i18next";

type Props = {
  item: any;
  onPressEdit?(item: any): void;
  onPressTrash(item: any): void;
  style?: StyleProp<ViewStyle>;
  edited?: boolean;
};

export default memo(
  ({ onPressEdit, onPressTrash, item, style, edited = true }: Props) =>
  {
    const { t } = useTranslation()

    return (
      <View style={[styles.container, style]}>
        {edited && (
          <Button
            text={t("Edit")}
            mode="fill"
            style={styles.button}
            onPress={() => onPressEdit && onPressEdit(item)}
            contentContainerStyle={styles.buttonContent}
          />
        )}
        <RectButton onPress={() => onPressTrash(item)}>
          <Icon2 size={24} name="trash" stroke={hexAlpha(COLOR.White, 30)} />
        </RectButton>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
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
