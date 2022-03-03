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

  return (
    <View style={styles.container}>
      <Btn onPress={openNewWalletScreen} title="Create a new wallet" />
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
});
