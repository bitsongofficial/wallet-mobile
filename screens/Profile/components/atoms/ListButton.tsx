import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Button, Icon2, IconName } from "components/atoms";
import { useTheme } from "hooks";
import { COLOR, hexAlpha } from "utils";
import { Avatar } from "../atoms";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress?(): void;
  arrow?: boolean;
  icon: IconName;
  children?: string;
  text?: string;
  Right?: JSX.Element;
};

export default observer<Props>(
  ({ style, icon, children, text, arrow, Right, onPress }) => {
    const theme = useTheme();
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <View style={styles.container}>
          <View style={styles.left}>
            <Icon2
              name={icon}
              size={24}
              style={styles.icon}
              stroke={hexAlpha(COLOR.White, 50)}
            />
            <Text style={[styles.text, theme.text.primary]}>
              {children || text}
            </Text>
          </View>
          <View style={styles.right}>
            {Right}
            {arrow && (
              <Icon2 name="chevron_right" size={16} stroke={COLOR.White} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 15,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  right: {
    flex: 1,
    flexDirection: "row",

    justifyContent: "flex-end",
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
