import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useStore } from "hooks";
import { ThemedGradient } from "components/atoms";
import { ListButton, Subtitle } from "./components/atoms";
import { Head } from "./components/moleculs";

type ValueTabs = "Coins" | "Fan Tokens";

// const tabs: ValueTabs[] = ["Coins", "Fan Tokens"];

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default observer<Props>(function MainScreen({ navigation }) {
  const {} = useStore();
  return (
    <>
      <StatusBar style="light" />

      <ThemedGradient style={styles.container}>
        <SafeAreaView style={styles.container}>
          <Head style={styles.head} />

          <Subtitle>Connected with</Subtitle>
          {/* <Wallet /> */}
          <ListButton>Add a new account</ListButton>
          <ListButton>Add a Watch account</ListButton>
          <Text>
            By creating an account, you’re agree to Cosmonautico {"\n"}
            Terms and Conditions & Privacy Policy
          </Text>
        </SafeAreaView>
      </ThemedGradient>
    </>
  );
});

const Wallet = () => {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ----------------

  head: {
    marginHorizontal: 25, // <- wrapper
    marginBottom: 30,
  },

  // ----------------
});
