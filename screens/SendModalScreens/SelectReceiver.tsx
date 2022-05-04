import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useContext } from "react";
import { useTheme } from "hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SendCoinStackParamList } from "navigation/SendCoinStack/types";
import { SendCoinContext } from "navigation/SendCoinStack/context";
import { CardAdress, CardAdressSelf, User } from "./components";
import { Button, ButtonBack } from "components/atoms";
import { users } from "./mock";
import { ScrollView } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<SendCoinStackParamList, "SelectReceiver">;

export default function SelectReceiver({ navigation }: Props) {
  const theme = useTheme();
  const { coin, receiver, setReceiver, setAddress, address, parentNav } =
    useContext(SendCoinContext);

  const navToRecap = useCallback(() => navigation.push("SendRecap"), []);
  const openScanner = useCallback(
    () => parentNav.push("ScannerQR", { onBarCodeScanned: setAddress }), // TODO: badcase. nested navigator knows about parent
    []
  );
  const goBack = useCallback(() => navigation.goBack(), []);

  return (
    <KeyboardAvoidingView
      style={{ flexGrow: 1 }}
      keyboardVerticalOffset={210}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <CardAdress
          value={address}
          onChange={setAddress}
          onPressQR={openScanner}
          style={[styles.input, styles.wrapper12]}
        />

        <View style={styles.wrapper33}>
          <Text style={[styles.subtitle, theme.text.primary]}>Prefered</Text>
          <View style={styles.users}>
            {users.map((user) => (
              <User user={user} key={user._id} />
            ))}
          </View>
          <Text style={[styles.subtitle, theme.text.primary]}>Recents</Text>
        </View>

        <CardAdressSelf coin={coin} style={[styles.self, styles.wrapper12]} />
      </ScrollView>
      <View style={styles.bottomView}>
        <View style={styles.buttonContainer}>
          <ButtonBack onPress={goBack} style={styles.buttonBack} />
          <Button
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
            onPress={navToRecap}
          >
            Preview Send
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  wrapper33: { marginHorizontal: 33 },
  wrapper12: { marginHorizontal: 12 },
  input: {
    marginTop: 31,
    marginBottom: 26,
    marginHorizontal: 12,
  },

  self: { marginTop: 21 },

  users: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 23,
    marginBottom: 40,
  },
  subtitle: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },

  bottomView: {
    flex: 1,
    justifyContent: "flex-end",
  },

  // ------ button ------
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginVertical: 8,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  buttonContent: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 19,
  },
  buttonBack: {
    position: "absolute",
    bottom: 18,
    left: 33,
  },
});
