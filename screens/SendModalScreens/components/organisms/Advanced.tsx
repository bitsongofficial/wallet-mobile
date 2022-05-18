import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useTheme } from "hooks";
import { Input } from "components/atoms";
import { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLOR, InputHandler } from "utils";
import { observer } from "mobx-react-lite";

type Props = {
  gas: InputHandler;
  memo: InputHandler;
  speed: InputHandler;

  style?: StyleProp<ViewStyle>;
};

export default observer(({ gas, memo, speed, style }: Props) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  return (
    <View style={style}>
      <View>
        <TouchableOpacity onPress={toggle}>
          <Text style={[theme.text.primary, styles.text]}>
            {isOpen ? "Hide Advanced" : "Show Advanced"}
          </Text>
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View>
          <Input
            bottomsheet
            placeholder="Set Gas"
            value={gas.value}
            onChangeText={gas.set}
            style={styles.input}
          />
          <Input
            bottomsheet
            placeholder="Medium"
            value={speed.value}
            onChangeText={speed.set}
            style={styles.input}
          />
          <Input
            bottomsheet
            placeholder="Add memo"
            value={memo.value}
            onChangeText={memo.set}
            style={styles.input}
          />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,

    marginBottom: 14,
  },
  input: { marginBottom: 16, backgroundColor: COLOR.Dark3 },
});
