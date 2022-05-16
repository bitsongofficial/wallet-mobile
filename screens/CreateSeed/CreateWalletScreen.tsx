import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
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
import { Fingerprint } from "./components/moleculs";
import { useCreateWallet, useFooter } from "./hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<RootStackParamList, "CreateWallet">;

export default observer<Props>(({ navigation }) => {
  const controller = useCreateWallet();
  const [goBack, goNext] = useFooter(controller.steps);

  useEffect(() => {
    controller.phrase.create();
  }, []);

  const [isHidden, setHidden] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleHidden = useCallback(async () => {
    if (!controller.biometric.access) {
      setModalVisible((value) => !value);
      controller.biometric.setAccess(true); // TODO: fix for device
    }
    setHidden((value) => !value);
  }, []);

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
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollviewContent}
          >
            <View>
              <Title text={controller.steps.title} />
              <Subtitle style={styles.subtitle}>
                This is the only way you will be able to {"\n"}recover your
                account. Please store it {"\n"}somewhere safe!
              </Subtitle>
            </View>

            {controller.steps.active === 0 && controller.phrase.words && (
              <CreateSeed
                isHidden={isHidden}
                onPressToggle={toggleHidden}
                phrase={controller.phrase}
              />
            )}

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
          <Footer
            onPressBack={goBack}
            onPressNext={goNext}
            nextButtonText="Continue"
            isHideNext={!controller.isCanNext}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <Fingerprint onCancel={() => setModalVisible(false)} />
        </View>
      </Modal>
    </>
  );
});

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
