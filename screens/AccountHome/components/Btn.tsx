import { Pressable, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  onPress(): void
}

export default function Btn({ title, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{title}</Text>
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
