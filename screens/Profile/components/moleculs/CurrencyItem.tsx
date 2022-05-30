import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { COLOR, hexAlpha } from "utils";
import { RadioButton } from "../atoms";

type Currency = {
  _id: number;
  name: string;
  title: string;
};

type Props = {
  value: Currency;
  onPress(value: Currency): void;
  isActive: boolean;
};

export default ({ value, isActive, onPress }: Props) => {
  const handlePress = useCallback(() => onPress(value), [onPress, value]);
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Text style={styles.name}>{value.name}</Text>
        <Text style={[styles.title, isActive && styles.text_active]}>
          {value.title}
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

  name: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 50,
    color: COLOR.RoyalBlue3,
  },

  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 50,
    color: hexAlpha(COLOR.White, 40),
    flex: 1,
    marginLeft: 42,
  },
  text_active: {
    color: COLOR.White,
  },
});
