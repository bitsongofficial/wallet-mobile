import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { animated, useSpring } from "@react-spring/native";
import { COLOR } from "utils";
import ThemedGradient from "./ThemedGradient";

type SwitchProps = {
  active?: boolean;
  onPress?(): void;
  gradient?: boolean;
  disabled?: boolean;
};

export default ({ onPress, active = false, gradient, disabled = false }: SwitchProps) => {
  const activeStyle = useSpring({ left: active ? 31 : 4 });

  const Background = gradient ? ThemedGradient : View;

  // isActive;

  // TODO:Check on phisic IOS
  return (
    <BaseButton onPress={onPress} enabled={!disabled}>
      <View style={[styles.container, !(gradient && active) && styles.background]}>
        <Background style={{ flex: 1 }}>
          <animated.View style={[styles.dot, activeStyle]}>
            <></>
          </animated.View>
        </Background>
      </View>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 55,
    height: 28,
    borderRadius: 20,
    overflow: "hidden",
  },
  background: {
    backgroundColor: COLOR.Dark3,
  },
  dot: {
    borderRadius: 30,
    width: 20,
    height: 20,
    backgroundColor: COLOR.White,
    position: "absolute",
    top: 4,
  },
});
