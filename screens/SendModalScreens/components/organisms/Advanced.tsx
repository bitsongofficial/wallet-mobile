import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useTheme } from "hooks";
import { Input } from "components/atoms";
import { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  gas: string;
  onChangeGas(gas: string): void;
  memo: string;
  onChangeMemo(memo: string): void;

  style?: StyleProp<ViewStyle>;
};

export default ({ gas, memo, onChangeGas, onChangeMemo, style }: Props) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  return (
    <View style={style}>
      <TouchableOpacity onPress={toggle}>
        <Text style={[theme.text.primary, styles.text]}>
          {isOpen ? "Hide Advanced" : "Show Advanced"}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View>
          <Input
            style={styles.input}
            value={gas}
            onChangeText={onChangeGas}
            placeholder="Set Gas"
          />
          <Input style={styles.input} placeholder="Medium" />
          <Input
            style={styles.input}
            value={memo}
            onChangeText={onChangeMemo}
            placeholder="Add memo"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,

    marginBottom: 14,
  },
  input: { marginBottom: 16 },
});
