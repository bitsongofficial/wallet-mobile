import { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Button, Icon2 } from "components/atoms";
import { COLOR, hexAlpha } from "utils";
import { useTranslation } from "react-i18next";

type ID = string;

type Props = {
  id: ID;
  onPressEdit?(id: ID): void;
  onPressTrash(id: ID): void;
  style?: StyleProp<ViewStyle>;
  edited?: boolean;
};

export default memo(
  ({ onPressEdit, onPressTrash, id, style, edited = true }: Props) => {
    const { t } = useTranslation()

    return (
      <View style={[styles.container, style]}>
        {edited && onPressEdit && (
          <Button
            text={t("Edit")}
            mode="fill"
            style={styles.button}
            onPress={() => onPressEdit && onPressEdit(id)}
            contentContainerStyle={styles.buttonContent}
          />
        )}
        <RectButton onPress={() => onPressTrash(id)}>
          <Icon2 size={24} name="trash" stroke={hexAlpha(COLOR.White, 30)} />
        </RectButton>
      </View>
    )
  }
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
