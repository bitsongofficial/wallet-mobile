import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

interface Props {
  title: string;
  onPress(): void;
  bgColor?: string;
  txtColor?: string;
  containerStyle?: ViewStyle;
}

export default function Btn({
  title,
  onPress,
  bgColor,
  txtColor,
  containerStyle,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        bgColor ? { backgroundColor: bgColor } : null,
        containerStyle ? containerStyle : null,
      ]}
    >
      <Text style={[styles.text, txtColor ? { color: txtColor } : null]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#E4E8FB",
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#5367D8",
    fontWeight: "bold",
    fontSize: 16,
  },
});
