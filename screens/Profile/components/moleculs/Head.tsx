import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";
import { Button } from "components/atoms";
import { COLOR, hexAlpha, InputHandler } from "utils";
import { Avatar, Title } from "../atoms";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useStore } from "hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { reaction } from "mobx";
import { useSpring } from "@react-spring/native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  style: StyleProp<ViewStyle>;
  input: InputHandler;
  onPressAvatar?(): void;
  avatar?: string;
  animtedValue: SharedValue<number>;
};

export default observer<Props>(
  ({ style, input, onPressAvatar, avatar, animtedValue }) => {
    const inputRef = useRef<TextInput>(null);
    const { dapp, user } = useStore();

    const openInput = useCallback(() => {
      inputRef.current?.focus();
    }, []);

    const [isNickValid, setIsNickValid] = useState(false);
    // TODO: need debouncer
    const checkNick = async (value: string) =>
      setIsNickValid(await dapp.checkNick(value));

    useEffect(() => reaction(() => input.value, checkNick), [input]);
    useEffect(() => {
      if (!input.isFocused && isNickValid) {
        user?.setNick(input.value);
      }
    }, [input.isFocused, isNickValid, user, input]);

    const hidden = useSpring({ opacity: input.isFocused ? 0.3 : 1 });

    const titleStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(
              animtedValue.value,
              [0, 32],
              [1, 0.8],
              Extrapolation.CLAMP
            ),
          },
        ],
        flexDirection: "row",
        alignItems: "center",
      };
    });

    const buttonStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(
              animtedValue.value,
              [0, 32],
              [1, 0],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    return (
      <View style={[styles.container, style]}>
        <View style={styles.user}>
          <TouchableOpacity onPress={onPressAvatar}>
            <Avatar
              style={styles.avatar}
              source={avatar ? { uri: avatar } : undefined}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Animated.View style={titleStyle}>
              <Title style={hidden}>
                {input.value || input.isFocused ? `@` : "Profile"}
              </Title>
              <TextInput
                // editable={editable}
                ref={inputRef}
                style={[styles.input]}
                value={input.value}
                onChangeText={input.set}
                onPressIn={(e) => e.preventDefault()}
                enabled={false}
                onFocus={input.focusON}
                onBlur={input.focusOFF}
                focusable={false}
              />
            </Animated.View>
          </View>
        </View>
        {!input.isFocused && (
          <Button
            text={!input.value ? "Set nick" : "Edit"}
            onPress={openInput}
            style={[styles.button, buttonStyle]}
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
            mode="fill"
          />
        )}
      </View>
    );
  }
);

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
    color: COLOR.White,
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
