import { useCallback, useState } from "react";
import { StyleSheet, Text, TextInputProps, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import { useTheme } from "hooks";
import { COLOR, InputHandler } from "utils";
import { Badge, Input } from "components/atoms";
import { Message } from "../atoms";

type Props = {
  gas: InputHandler;
  memo: InputHandler;
  speed: InputHandler;
  onFocus?: TextInputProps["onFocus"];
};

export default observer(({ gas, memo, speed, onFocus }: Props) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);
  const messages = [{}];
  return (
    <>
      <View style={{ flexDirection: "row", marginBottom: 16, marginLeft: 11 }}>
        <Text style={[theme.text.primary, styles.title]}>Messages</Text>
        <Badge count={1} />
      </View>

      {messages.map((message) => (
        <Message item={message} />
      ))}

      <View style={styles.toggleHide}>
        <TouchableOpacity onPress={toggle}>
          <Text style={[theme.text.primary, styles.text]}>
            {isOpen ? "Hide Advanced" : "Show Advanced"}
          </Text>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <>
          <Input
            bottomsheet
            placeholder="Set Gas"
            value={gas.value}
            onChangeText={gas.set}
            style={styles.input}
            onFocus={onFocus}
          />
          <Input
            bottomsheet
            placeholder="Medium"
            value={speed.value}
            onChangeText={speed.set}
            style={styles.input}
            onFocus={onFocus}
          />
          <Input
            bottomsheet
            placeholder="Add memo"
            value={memo.value}
            onChangeText={memo.set}
            style={styles.input}
            onFocus={onFocus}
          />
        </>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 16,

    marginRight: 7,
  },

  badge: {
    backgroundColor: "#4D60E4",
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  toggleHide: {
    marginBottom: 14,
    width: 100,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
  },
  input: { marginBottom: 16, backgroundColor: COLOR.Dark3 },
});
