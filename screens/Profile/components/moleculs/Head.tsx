import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Button } from "components/atoms";
import { useTheme } from "hooks";
import { COLOR, hexAlpha } from "utils";
import { Avatar } from "../atoms";
import Title from "../atoms/Title";

type Props = {
  style: StyleProp<ViewStyle>;
};

export default observer<Props>(({ style }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <View style={styles.user}>
        <Avatar style={styles.avatar} />
        <Title>Profile</Title>
      </View>
      <Button
        text="Set nick"
        style={styles.button}
        contentContainerStyle={styles.buttonContent}
        textStyle={styles.buttonText}
        mode="fill"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatar: {
    marginRight: 18,
  },

  user: {
    flexDirection: "row",
    alignItems: "center",
  },

  button: {
    backgroundColor: hexAlpha(COLOR.Lavender, 10),
  },
  buttonContent: {
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
