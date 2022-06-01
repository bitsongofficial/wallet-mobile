import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { COLOR, hexAlpha } from "utils";
import { Header, Icon2, Input } from "components/atoms";
import { Pagination } from "components/moleculs";
import { Subtitle, Title } from "./components/atoms";
import { Footer, SetPin, CreateSeed } from "./components/organisms";
import { useCreateWallet, useFooter } from "./hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import {
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateAsync,
} from "expo-local-authentication";

type Props = NativeStackScreenProps<RootStackParamList, "CreateWallet">;

export default observer<Props>(({ navigation }) => {
  const controller = useCreateWallet();
  const [goBack, goNext] = useFooter(controller.steps);

  useEffect(() => {
    controller.phrase.create();
  }, []);

  const [isHidden, setHidden] = useState(true);

  const checkBio = async () => {
    if (!controller.biometric.access) {
      await biometricsAuth().catch((e) => console.error("NO", e)); // TODO: need handlers

      // result && controller.biometric.setAccess(result.success);
      controller.biometric.setAccess(true);
    }
  };

  const toggleHidden = useCallback(
    () => checkBio().then(() => setHidden((value) => !value)),
    []
  );

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <Header
          Left={
            <Pagination
              count={controller.steps.titles.length}
              acitveIndex={controller.steps.active}
            />
          }
          Center={<Icon2 name="logo" size={56} />}
        />
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View>
            <Title text={controller.steps.title} />
            <Subtitle style={styles.subtitle}>
              This is the only way you will be able to {"\n"}recover your
              account. Please store it {"\n"}somewhere safe!
            </Subtitle>
          </View>
          {controller.steps.active === 0 ? (
            controller.phrase.words && (
              <CreateSeed
                isHidden={isHidden}
                onPressToggle={toggleHidden}
                phrase={controller.phrase}
              />
            )
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollviewContent}
            >
              {controller.steps.active === 1 && (
                <Input
                  placeholder="Wallet Name"
                  value={controller.walletName.value}
                  onChangeText={controller.walletName.set}
                  style={styles.input}
                />
              )}

              {controller.steps.active === 2 && <SetPin pin={controller.pin} />}

              {controller.steps.active === 3 && (
                <SetPin pin={controller.confirm} />
              )}
            </ScrollView>
          )}

          <Footer
            onPressBack={goBack}
            onPressNext={goNext}
            nextButtonText="Continue"
            isHideNext={!controller.isCanNext}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
});

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    flexGrow: 1,
  },
  overlay: {
    paddingHorizontal: 27,
    flex: 1,
    justifyContent: "center",
    backgroundColor: hexAlpha(COLOR.Dark2, 60),
  },
  keyboardAvoiding: {
    flexGrow: 1,
    marginHorizontal: 30,
  },
  scrollviewContent: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 16,
  },
  // -------- Main --------
  header: {
    paddingHorizontal: 45,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  center: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  // ------ Text -------
  subtitle: {
    marginTop: 8,
  },
  toggle: {
    marginTop: 24,
    width: 173,
  },
  input: {
    marginTop: 24,
  },
});
