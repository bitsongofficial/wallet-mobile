import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { COLOR } from "utils";
import { Phrase } from "components/moleculs";
import { Input } from "components/atoms";
import { useImportFromSeedController } from "./controllers";
import { Subtitle, Title } from "./components/atoms";
import { ButtonToggle, PinCode } from "./components/moleculs";
import { Header, Footer } from "./components/organisms";
import { Numpad } from "screens/SendModalScreens/components"; // todo: make common component

type Props = NativeStackScreenProps<RootStackParamList, "CreateWallet">;

export default observer<Props>(({ navigation }) => {
  const controller = useImportFromSeedController();

  const goBack = useCallback(
    () =>
      controller.steps.active > 0
        ? controller.steps.prev()
        : navigation.goBack(),
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
        <Header activeIndex={controller.steps.active} />

        <View style={styles.center}>
          <View style={styles.fullSize}>
            <Title>{controller.steps.title}</Title>
            <Subtitle style={styles.subtitle}>
              This is the only way you will be able to {"\n"}recover your
              account. Please store it {"\n"}somewhere safe!
            </Subtitle>

            {controller.steps.active === 0 && controller.phrase.words && (
              <>
                {/* <View style={styles.toggle}>
                  <ButtonToggle isHidden={isHidden} onPress={toggleHidden} />
                </View>
                <ScrollView
                  style={styles.scrollview}
                  contentContainerStyle={styles.scrollviewContainer}
                >
                  <Phrase hidden={isHidden} value={controller.phrase.words} />
                </ScrollView> */}
              </>
            )}

            {controller.steps.active === 1 && (
              <Input
                placeholder="Wallet Name"
                value={controller.walletName.value}
                onChangeText={controller.walletName.set}
                style={styles.input}
              />
            )}

            {controller.steps.active === 2 && (
              <>
                <PinCode value={controller.pin.value} style={styles.pin} />
                <Numpad
                  onPressRemove={controller.pin.remove}
                  onPress={controller.pin.push}
                  style={styles.numpad}
                />
              </>
            )}

            {controller.steps.active === 3 && (
              <>
                <PinCode value={controller.confirm.value} style={styles.pin} />
                <Numpad
                  onPressRemove={controller.confirm.remove}
                  onPress={controller.confirm.push}
                  style={styles.numpad}
                />
              </>
            )}
          </View>

          <Footer
            onPressBack={goBack}
            onPressNext={controller.nextStep}
            nextButtonText="Continue"
          />
        </View>
      </SafeAreaView>
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
  pin: {
    flex: 1,
  },
  numpad: {
    marginHorizontal: 15,
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 30,
  },

  // ----- ScrollView -------
  scrollview: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  scrollviewContainer: {
    paddingTop: 15,
    paddingBottom: 6,
  },
});
