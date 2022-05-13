import { useCallback, useEffect, useState } from "react";
import { Modal, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { COLOR, hexAlpha } from "utils";
import { Header, Icon2, Input } from "components/atoms";
import { Pagination } from "components/moleculs";
import { useCreateSeedController } from "./controllers";
import { Subtitle, Title } from "./components/atoms";
import { Footer, SetPin, CreateSeed } from "./components/organisms";
import { Fingerprint } from "./components/moleculs";

type Props = NativeStackScreenProps<RootStackParamList, "CreateWallet">;

export default observer<Props>(({ navigation }) => {
  const controller = useCreateSeedController();

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

  const goBack = useCallback(
    () =>
      controller.steps.active > 0
        ? controller.steps.prev()
        : navigation.goBack(),
    [navigation, controller.steps.active]
  );

  const goNext = useCallback(
    () =>
      controller.steps.active < controller.steps.titles.length - 1
        ? controller.steps.next()
        : navigation.reset({ index: 0, routes: [{ name: "Root" }] }),
    [navigation, controller.steps.active]
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
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

        <View style={styles.center}>
          <View style={styles.fullSize}>
            <Title>{controller.steps.title}</Title>
            <Subtitle style={styles.subtitle}>
              This is the only way you will be able to {"\n"}recover your
              account. Please store it {"\n"}somewhere safe!
            </Subtitle>

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
          </View>

          <Footer
            onPressBack={goBack}
            onPressNext={goNext}
            nextButtonText="Continue"
            isDisableNext={!controller.isCanNext}
          />
        </View>
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
    flex: 1,
    backgroundColor: COLOR.Dark3,
    flexGrow: 1,
    paddingVertical: 16,
  },
  overlay: {
    paddingHorizontal: 27,
    flex: 1,
    justifyContent: "center",
    backgroundColor: hexAlpha(COLOR.Dark2, 60),
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
  fullSize: { flexGrow: 1 },
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
