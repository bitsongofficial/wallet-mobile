import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateAsync,
} from "expo-local-authentication";
import { Button, Icon2 } from "components/atoms";
import { COLOR } from "utils";
import { useEffect } from "react";

type Props = {
  children?: string;
  style?: StyleProp<ViewStyle>;
  onCancel(): void;
};

const biometricsAuth = async () => {
  const compatible = await hasHardwareAsync();
  if (!compatible)
    throw "This device is not compatible for biometric authentication";

  const enrolled = await isEnrolledAsync();
  if (!enrolled)
    throw `This device doesn't have biometric authentication enabled`;

  const result = await authenticateAsync();
  if (!result.success) throw `${result.error} - Authentication unsuccessful`;
  return result;
};

export default function Fingerprint({ style, onCancel }: Props) {
  useEffect(() => {
    biometricsAuth()
      .catch((e) => console.error("NO", e))
      .then((result) => console.log("YES", result));
  }, []);
  return (
    <View style={[styles.container, style]}>
      <Icon2 size={75} name="fingerprint_gradient" style={styles.fingerprint} />

      <Text style={styles.title}>Biometric Approve</Text>
      <Text style={styles.caption}>
        This is the only way you will be able to recover your account. Please
        store it somewhere safe!
      </Text>

      <Button
        style={styles.button}
        contentContainerStyle={styles.buttonContent}
        textStyle={styles.buttonText}
        onPress={onCancel}
      >
        Cancel
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark2,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 22,
    alignItems: "center",
  },

  fingerprint: {
    marginTop: 40,
  },
  title: {
    color: COLOR.White,
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center",

    marginTop: 32,
  },
  caption: {
    color: COLOR.Grey1,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",

    marginTop: 8,
  },

  button: { marginTop: 43 },

  buttonContent: {
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  buttonText: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 19,
  },
});
