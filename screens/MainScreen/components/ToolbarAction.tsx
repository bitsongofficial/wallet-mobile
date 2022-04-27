import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button, Icon } from "components/atoms";

type Props = {
  onPress?(): void;
  Icon?: JSX.Element;
  title?: string;
  style?: StyleProp<ViewStyle>;
};

export default ({ Icon, onPress, title, style }: Props) => (
  <View style={[styles.container, style]}>
    <Button style={styles.button} onPress={onPress}>
      {Icon}
    </Button>
    <Text style={styles.text}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {},
  button: {
    marginBottom: 16,
  },
  text: {
    fontFamily: "Circular Std",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 16,
    color: "#FFFFFF",
  },
});
