import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Button, Icon2, IconName } from "components/atoms";
import { useTheme } from "hooks";
import { COLOR, hexAlpha } from "utils";
import { Avatar } from "../atoms";

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress?(): void;
  arrow?: boolean;
  icon: IconName;
  children?: string;
  text?: string;
};

export default observer<Props>(({ style, icon, children, text }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <Icon2 name={icon} size={24} style={styles.icon} />
      <Text style={[styles.text, theme.text.primary]}>{children || text}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: 22,
  },

  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
  },
});
