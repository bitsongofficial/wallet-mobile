import { useCallback, useMemo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { useDimensions } from "@react-native-community/hooks";
import { useStore } from "hooks";
import { COLOR, hexAlpha } from "utils";
import { Button, Icon2 } from "components/atoms";
import { Header } from "./components/atoms";

type Props = {
  style: StyleProp<ViewStyle>;
  close(): void;
};

export default observer(function ReceiveModal({ style, close }: Props) {
  const { user } = useStore();
  const { screen } = useDimensions();

  const shortAddress = useMemo(() => {
    const text = user?.data.address;
    return text ? `${text.substring(0, 16)}..${text.slice(-7)}` : undefined;
  }, [user?.data.address]);

  const copyToClipboard = useCallback(() => {
    if (user?.data.address) Clipboard.setString(user?.data.address);
  }, [user?.data.address]);

  return (
    <View style={[styles.wrapper, style]}>
      <Header
        title="Qr Code"
        subtitle="Scan to receive import"
        style={styles.header}
      />

      <View style={styles.qr_code}>
        <QRCode value={user?.data.address} size={screen.width * 0.7} />
      </View>

      <Text style={styles.subtitle}>Copy address</Text>

      <View style={styles.card}>
        <Text style={styles.address}>{shortAddress}</Text>
        <RectButton style={styles.buttonCopy} onPress={copyToClipboard}>
          <Icon2 name="copy" stroke={hexAlpha(COLOR.White, 30)} size={17} />
        </RectButton>
      </View>

      <View style={styles.footer}>
        <Button
          text="Close"
          onPress={close}
          contentContainerStyle={styles.buttonContent}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 30,
    flex: 1,
  },

  header: {
    marginBottom: 40,
  },

  subtitle: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
    color: COLOR.White,
    marginBottom: 22,
  },

  qr_code: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 19,

    marginBottom: 40,
  },

  address: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: COLOR.White,
  },
  buttonCopy: {
    height: "100%",
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: COLOR.Dark3,
    height: 70,
    justifyContent: "space-between",
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 20,
    paddingLeft: 30,

    alignItems: "center",
  },

  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
  },

  buttonContent: {
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
