import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ILang } from "screens/Profile/type";
import { COLOR, hexAlpha } from "utils";
import { RadioButton } from "../atoms";

type Props = {
  value: ILang;
  isActive: boolean;
  onPress(value: ILang): void;
};

export default ({ value, isActive, onPress }: Props) => {
  const handlePress = useCallback(() => onPress(value), [onPress, value]);
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Text style={[styles.text, isActive && styles.text_active]}>
          {value.name}
        </Text>
        <RadioButton isActive={isActive} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    marginBottom: 4,
    paddingLeft: 25,
    paddingRight: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 50,
    color: hexAlpha(COLOR.White, 40),
  },
  text_active: { color: COLOR.White },
});
