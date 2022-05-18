import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Button, ButtonBack } from "components/atoms";

type Props = {
  isShowBack?: boolean;
  onPressBack(): void;
  centerTitle?: string;
  onPressCenter(): void;
  style?: StyleProp<ViewStyle>;
};

export default function Footer({
  onPressBack,
  onPressCenter,
  centerTitle,
  isShowBack = true,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonContainer}>
        <View style={styles.flex1}>
          {isShowBack && <ButtonBack onPress={onPressBack} />}
        </View>
        <View style={styles.flex2}>
          <Button
            text={centerTitle}
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
            onPress={onPressCenter}
          />
        </View>
        <View style={styles.flex1} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
  },

  flex1: { flex: 1, justifyContent: "center" },
  flex2: { flex: 2, justifyContent: "center" },

  buttonContainer: {
    justifyContent: "space-around",
    marginVertical: 8,
    flexDirection: "row",
    width: "100%",
  },
  buttonContent: {
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 19,
  },
});
