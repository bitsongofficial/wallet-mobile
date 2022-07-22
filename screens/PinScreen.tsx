import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { COLOR } from "utils";
import { Button, Icon2 } from "components/atoms";
import { Header } from "components/organisms";
import { Subtitle, Title } from "./CreateSeed/components/atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Pin, Timer } from "classes";
import { useStore } from "hooks";
import { PinCode } from "./CreateSeed/components/moleculs";
import { Numpad } from "components/moleculs";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSpring } from "@react-spring/native";

type Props = NativeStackScreenProps<RootStackParamList, "PinRequest">;

// ----- Animation ----------
const ANGLE = 15;
const TIME = 200;
const EASING = Easing.elastic(1.5);

export default observer<Props>(({ navigation, route }) => {
  const { callback, title = "Confirm with PIN", errorMax = 3, disableVerification = false } = route.params;

  const goBack = useCallback(() => navigation.goBack(), []);

  const pin = useMemo(() => new Pin(), []);

  const [isConfirm, setConfirm] = useState<boolean | null>(null);
  const [countError, setErrorCount] = useState(0);

  const isError = isConfirm !== null && !isConfirm;
  const isBlocked = countError === errorMax;

  // --------- Check -------------
  const { localStorageManager } = useStore();

  useEffect(() => {
    if (pin.isValid) {
      (async () => {
        const isConfirm = await localStorageManager.verifyPin(pin.value) || disableVerification;
        setConfirm(isConfirm);
        // setConfirm(true);
        if (isConfirm) {
          setErrorCount(0);
        } else {
          setErrorCount((v) => v + 1);
        }
      })()
    } else {
      setConfirm(null);
    }
  }, [pin.isValid]);

  // ----------- Confirm ----------
  useEffect(() => {
    if (isConfirm) {
      const token = setTimeout(() => {
        callback(pin.value);
        goBack();
      }, 1000);
      return () => clearTimeout(token);
    }
  }, [isConfirm]);

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      callback();
      goBack();
      return true;
    });
    return () => handler.remove();
  }, [goBack]);

  // ---------- Block -----------
  const timer = useMemo(() => new Timer(), []);

  useEffect(
    () =>
      timer.emmiter.on("stop", () => {
        setErrorCount(0);
        pin.clear();
      }),
    []
  );

  useEffect(() => {
    if (isBlocked) timer.start(30);
  }, [isBlocked]);

  // ---------- Anim Error------------

  const rotation = useSharedValue(1);

  const startAnim = () => {
    rotation.value = withSequence(
      // deviate left to start from -ANGLE
      withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
      // wobble between -ANGLE and ANGLE 7 times
      withRepeat(
        withTiming(ANGLE, {
          duration: TIME,
          easing: EASING,
        }),
        3,
        true
      ),
      // go back to 0 at the end
      withTiming(0, { duration: TIME / 2, easing: EASING })
    );
  };

  useEffect(() => {
    isError && startAnim();
  }, [isError]);

  const animErrorStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
  }));

  const numpad = useMemo(
    () => Pin.getKeyboard({ random: route.params.isRandomKeyboard }),
    [route.params.isRandomKeyboard]
  );

  return (
    <>
      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <Header style={styles.header} />
        {!isConfirm && !isBlocked && (
          <View style={styles.wrapper}>
            <Title text={title} style={styles.title} />
            <Subtitle style={styles.subtitle}>
              This is the only way you will be able to {"\n"}
              recover your account. Please store it {"\n"}
              somewhere safe!
            </Subtitle>

            <Animated.View style={[animErrorStyle, styles.pin]}>
              <PinCode
                isError={isError}
                isHidden={route.params.isHiddenCode}
                value={pin.value}
                style={styles.pin}
              />
            </Animated.View>

            <Numpad
              onPressRemove={pin.remove}
              onPress={pin.push}
              style={styles.numpad}
              numpad={numpad}
            />
          </View>
        )}
        {isConfirm && !isBlocked && (
          <View style={styles.confirm}>
            <Icon2
              name="check_fulfilled"
              size={80}
              stroke={COLOR.GreenCrayola}
              style={styles.icon}
            />
            <Title style={styles.title_confirmed}>Operation Confirmed</Title>
            <Subtitle style={styles.subtitle_confirmed}>
              Congratulations, {"\n"}
              Operation successfully confirmed.
            </Subtitle>
          </View>
        )}
        {isBlocked && (
          <View style={styles.confirm}>
            <Icon2
              name="check_lock"
              size={80}
              stroke={COLOR.Pink}
              style={styles.icon}
            />
            <Title style={styles.title_confirmed}>Wallet app is blocked</Title>
            <Subtitle style={styles.subtitle_confirmed}>
              Too many PIN attempts
            </Subtitle>
            <View
              style={{
                marginTop: 28,
                width: 187,
                height: 177,
                backgroundColor: COLOR.Dark2,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Subtitle style={styles.subtitle_confirmed}>
                Try again in:
              </Subtitle>
              <Text
                style={{
                  fontFamily: "CircularStd",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: 80,
                  lineHeight: 101,
                  color: COLOR.White,
                }}
              >
                {timer.time}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 30,
    flex: 1,
  },
  confirm: { alignItems: "center" },

  header: {
    height: 70,
  },

  icon: { marginTop: 90, marginBottom: 64 },
  button: {
    height: 60,
    justifyContent: "center",
  },

  scrollview: { flex: 1 },
  scrollviewContent: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 16,
  },
  // ------ Text -------
  title: {
    marginTop: 30,
  },
  title_confirmed: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    color: COLOR.Marengo,
  },
  subtitle_confirmed: {
    textAlign: "center",
    color: COLOR.Marengo,
    fontSize: 16,
    lineHeight: 20,
  },

  // ------- Pin Code -------
  numpad: {
    marginHorizontal: 15,
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 30,
  },
  pin: { flex: 1 },

  // -------- Button -------
  buttonContent: {
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
