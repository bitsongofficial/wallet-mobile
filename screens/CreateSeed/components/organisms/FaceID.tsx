import { useState, useCallback, useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { COLOR } from "utils";
import { Button, Icon2 } from "components/atoms";
import { Subtitle, Title } from "../atoms";
import { AuthenticationType } from "expo-local-authentication";
import { useMemo } from "react";
import { CheckMethod } from "stores/type";
import { useStore } from "hooks";

type Props = {
  onDone(method: CheckMethod | null): void;
  authTypes: AuthenticationType[];
  pin?: string;
};

export default ({ onDone, authTypes, pin }: Props) => {
  const isEnableFaceID = useMemo(
    () => authTypes.includes(AuthenticationType.FACIAL_RECOGNITION),
    [authTypes]
  );

  const { settings } = useStore()

  const [method, setMethod] = useState<CheckMethod>(() =>
    isEnableFaceID ? "FaceID" : "TouchID"
  );

  const toggleMethod = useCallback(
    () => setMethod((method) => (method === "FaceID" ? "TouchID" : "FaceID")),
    []
  );

  const activate = useCallback(async () => {
    await settings.setBiometric(true, pin)
    onDone(method)
  }, [onDone]);
  const skip = useCallback(() => onDone(null), [onDone]);

  const authName = method === "FaceID" ? (Platform.OS === "ios" ? "Face ID" : "Facial Recognition") : "Touch ID"

  return (
    <>
      <View style={styles.container}>
        <Icon2
          style={styles.icon}
          name={
            method === "FaceID" ? "faceid_gradient" : "fingerprint_gradient"
          }
          size={90}
        />

        <Title style={styles.title}>
          Enable {authName}
        </Title>
        <Subtitle style={styles.subtitle}>
          Do you want to enable the {authName} so{"\n"}
          you will use this instead{"\n"}
          of the pin?
        </Subtitle>

        {isEnableFaceID && (
          <Button
            mode="fill"
            onPress={toggleMethod}
            text={`Use ${method === "FaceID" ? "Touch ID" : "Face ID"}`}
            style={styles.button}
            textStyle={styles.buttonText}
            Right={
              <Icon2
                name="chevron_right"
                size={18}
                stroke={COLOR.White}
                style={{ marginLeft: 5 }}
              />
            }
          />
        )}
      </View>

      <View style={styles.footer}>
        <Button
          text="Activate now"
          onPress={activate}
          textAlignment={"center"}
          style={styles.footerButton}
        />
        <Button
          text="Cancel"
          mode="fill"
          textAlignment={"center"}
          onPress={skip}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 85,
  },
  icon: {
    marginBottom: 56,
  },

  title: {
    fontWeight: "700",
    textAlign: "center",

    marginBottom: 24,
  },
  subtitle: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    color: COLOR.Marengo,
  },
  button: {
    marginTop: 32,
  },
  buttonText: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },

  // Footer
  footer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  footerButton: {
    marginBottom: 8,
  },
  footerButtonContent: {
    paddingVertical: 17,
  },
  footerButtonText: {},
});
