import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SvgCss } from "react-native-svg";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "hooks";
import { COLOR } from "utils";
import { RootStackParamList } from "../types";
import svg from "assets/svg2";
import { Button, Icon2, Loader } from "components/atoms";
import { animated, useSpring } from "@react-spring/native";

type Status = "pending" | "fulfilled" | "rejected";

export default function LoaderScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "Loader">) {
  const theme = useTheme();

  const [status, setStatus] = useState<Status>("pending");

  const result = useRef();
  const error = useRef();

  useEffect(() => {
    route.params
      ?.callback()
      .then((r) => {
        result.current = r;
        setStatus("fulfilled");
      })
      .catch((e) => {
        error.current = e;
        setStatus("rejected");
      });

    return () => {
      const onError = route.params?.onError;
      const onSucceess = route.params?.onSucceess;

      onError && onError(error.current);
      onSucceess && onSucceess(result.current);
    };
  }, []);

  const title = useMemo(() => {
    switch (status) {
      case "fulfilled":
        return "Transaction Successful";
      case "rejected":
        return "Transaction Error";
      default:
      case "pending":
        return "Transaction Pending";
    }
  }, [status]);

  const fulfilledStyle = useSpring({
    opacity: status === "fulfilled" ? 1 : 0,
    config: { duration: 1000 },
  });

  const goBack = useCallback(() => navigation.goBack(), []);

  const Header = route.params?.header;

  return (
    <>
      <StatusBar style="light" />

      {Header && <Header navigation={navigation} />}

      <KeyboardAvoidingView style={styles.keyboardAvoiding}>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 150 }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 165,
                marginBottom: 25,
              }}
            >
              {status == "pending" && <Loader size={80} />}
              {status == "fulfilled" && (
                <Icon2
                  name="check_fulfilled"
                  size={80}
                  stroke={COLOR.GreenCrayola}
                />
              )}
              {status == "rejected" && (
                <Icon2 name="check_error" size={80} stroke={COLOR.Pink} />
              )}
              <animated.View
                style={[
                  fulfilledStyle,
                  {
                    height: 165,
                    right: Dimensions.get("window").width * 0.25,
                    top: 15,
                    position: "absolute",
                  },
                ]}
              >
                <SvgCss xml={svg.confetti} style={styles.confetti} />
              </animated.View>
            </View>
          </View>
          <Text style={[styles.title, theme.text.primary]}>{title}</Text>
          <Text style={styles.subtitle}>
            {status == "pending" && (
              <>
                Transaction has been broadcasted to{"\n"}
                the blockchain and pending{"\n"}
                confirmation.
              </>
            )}
            {status == "fulfilled" && (
              <>
                Congratulations!{"\n"}
                Your transaction has been completed{"\n"}
                and confirmed by the blockchain.
              </>
            )}
            {status == "rejected" && (
              <>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </>
            )}
          </Text>

          <animated.View
            style={[
              fulfilledStyle,
              {
                flexGrow: 1,
                justifyContent: "flex-end",
                paddingHorizontal: 30,
              },
            ]}
          >
            <Button
              text="Confirm"
              onPress={goBack}
              contentContainerStyle={styles.buttonContent}
              textStyle={styles.buttonText}
            />
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Button
                text="View on Mintscan"
                mode="fill"
                contentContainerStyle={styles.buttonContent}
                textStyle={styles.buttonText}
                Right={
                  <Icon2 name="chevron_right" stroke={COLOR.White} size={18} />
                }
              />
            </View>
          </animated.View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoiding: {
    flexGrow: 1,
    backgroundColor: COLOR.Dark3,
  },
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 25,

    textAlign: "center",
    marginBottom: 24,
  },
  subtitle: {
    color: COLOR.Marengo,
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
  },
  confetti: {
    width: 203,
    height: 165,
    opacity: 0.5,
  },
  // Button
  buttonText: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
  buttonContent: { paddingVertical: 17 },
});
