import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  TapGestureHandler,
  BaseButton,
} from "react-native-gesture-handler";
import { animated, useSpring } from "@react-spring/native";
import { COLOR } from "utils";

type SwitchProps = {
  active?: boolean;
  onPress?(): void;
};

export default ({ onPress, active = false }: SwitchProps) => {
  const activeStyle = useSpring({ left: active ? 31 : 4 });

  // console.log("isActive", isActive);
  // isActive;

  // TODO:Check on phisic IOS
  return (
    <BaseButton onPress={onPress}>
      <View style={styles.container}>
        <animated.View style={[styles.dot, activeStyle]}>
          <></>
        </animated.View>
      </View>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 55,
    height: 28,
    backgroundColor: COLOR.Dark3,
    borderRadius: 20,
  },
  dot: {
    //
    borderRadius: 30,
    width: 20,
    height: 20,
    backgroundColor: COLOR.White,
    position: "absolute",
    top: 4,
  },
});
