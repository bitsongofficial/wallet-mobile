import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Button } from "components/atoms";
import { COLOR, hexAlpha, InputHandler } from "utils";
import { Avatar, Title } from "../atoms";
import { TextInput } from "react-native-gesture-handler";

type Props = {
  style: StyleProp<ViewStyle>;
  input: InputHandler;
  isOpenInput: boolean;
  onPressSetNick(): void;
};

export default observer<Props>(({ style, input, isOpenInput }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.user}>
        <Avatar style={styles.avatar} />
        {isOpenInput ? (
          <TextInput
            style={styles.input}
            value={input.value}
            onChangeText={input.set}
            onFocus={input.focusON}
            onBlur={input.focusOFF}
          />
        ) : (
          <Title>Profile</Title>
        )}
      </View>
      <Button
        text="Set nick"
        onPress={open}
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

  user: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 18,
  },
  input: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 28,
    lineHeight: 35,
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
