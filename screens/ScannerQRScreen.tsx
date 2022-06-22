import { StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { BarCodeScanner } from "expo-barcode-scanner";
import { BarCodeScannedCallback } from "expo-barcode-scanner/build/BarCodeScanner";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore, useTheme } from "hooks";
import { Button } from "components/atoms";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { observer } from "mobx-react-lite";
import { TextInput } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<RootStackParamList, "ScannerQR">;

export default observer<Props>(({ navigation, route }) => {
  const theme = useTheme();
  const {dapp} = useStore()
  const test: BarCodeScannedCallback = (event) => {
    console.log("event :>> ", event);
  };

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [uri, setUri] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = useCallback<BarCodeScannedCallback>(
    ({ data }) => {
      if (!scanned) {
        setScanned(true);
        navigation.goBack();
        route.params.onBarCodeScanned(data);
      }
    },
    [route, scanned, navigation]
  );

  return (
    <>
      <StatusBar hidden />
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={[styles.title, theme.text.primary]}>Scan QR Code</Text>
          <Text style={[styles.caption]}>
            {hasPermission === null
              ? "Requesting for camera permission"
              : hasPermission === false
              ? "No access to camera"
              : "This is the only way you will be able to recover your account. Please store it somewhere safe!"}
          </Text>
          {/* <TextInput
            style={[theme.text.primary]}
            placeholder="Public Address"
            value={uri}
            onChangeText={setUri}></TextInput> */}
          <View style={styles.sector}>
            <BarCodeScanner
              barCodeTypes={["qr"]}
              onBarCodeScanned={handleBarCodeScanned}
              style={{
                flexGrow: 1,
                transform: [{ scale: 2 }],
              }}
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Button
            textStyle={styles.buttonText}
            contentContainerStyle={styles.buttonSize}
            onPress={() => {dapp.connect(uri)}}
          >
            Scan QR Code
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#23283d",
    flex: 1,
  },
  center: {
    alignItems: "center",
    marginHorizontal: 49,
  },
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 21,
    lineHeight: 27,
    marginTop: 30,
  },
  caption: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 39,

    color: "#6B6B84", // TODO: themed this!
    marginBottom: 80,
  },
  sector: {
    width: "100%",
    height: "50%",
    borderRadius: 30,
    // borderColor: "white",
    // borderLeftColor: "white",
    // borderLeftWidth: 3,
    // borderRightWidth: 3,
    overflow: "hidden",
  },

  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
  },
  buttonSize: {
    paddingVertical: 18,
    paddingHorizontal: 35,
  },
  buttonText: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 19,
  },
});
