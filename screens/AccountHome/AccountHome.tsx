import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Btn } from "./components";
import { useCallback } from "react";

export default function AccountHome({
  navigation,
}: RootStackScreenProps<"AccountHome">) {
  const openNewWalletScreen = useCallback(() => {
    navigation.navigate("CreateWallet");
  }, []);

  const importExistingWallet = useCallback(() => {
    navigation.navigate("ImportWallet");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logo} />
      <Btn onPress={openNewWalletScreen} title="Create a new wallet" />
      <Btn
        onPress={importExistingWallet}
        title="Import existing wallet"
        containerStyle={styles.importBtn}
        bgColor="#4E63D7"
        txtColor="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  importBtn: {
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
    backgroundColor: "#E4E8FB",
    borderRadius: 20,
    marginBottom: 150,
  },
});
