import { useCallback } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { COLOR } from "utils";
import { Button, Header, Icon2, Input } from "components/atoms";
import { Pagination } from "components/moleculs";
import { useImportFromSeedController } from "./controllers";
import { Subtitle, Title } from "./components/atoms";
import { Footer, SetPin, PhraseInput } from "./components/organisms";

type Props = NativeStackScreenProps<RootStackParamList, "ImportFromSeed">;

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
      <KeyboardAvoidingView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.container}>
            <Header
              Left={
                <Pagination
                  count={controller.steps.titles.length}
                  acitveIndex={controller.steps.active}
                />
              }
              Center={<Icon2 name="logo" size={56} />}
              style={styles.header}
            />

            <View style={styles.mh30}>
              <Title>{controller.steps.title}</Title>
              <Subtitle style={styles.subtitle}>
                This is the only way you will be able to {"\n"}recover your
                account. Please store it {"\n"}somewhere safe!
              </Subtitle>
            </View>

            {controller.steps.active === 0 && controller.phrase.words && (
              <>
                <View style={styles.paste}>
                  <Button
                    text="Paste"
                    contentContainerStyle={styles.buttonContent}
                    textStyle={styles.buttonText}
                    onPress={controller.steps.next}
                  />
                </View>
                <PhraseInput phrase={controller.phrase} />
              </>
            )}

            <View style={styles.fullSize}>
              <View style={styles.center}>
                {controller.steps.active === 1 && (
                  <Input
                    placeholder="Wallet Name"
                    value={controller.walletName.value}
                    onChangeText={controller.walletName.set}
                    style={styles.input}
                  />
                )}
                {controller.steps.active === 2 && (
                  <SetPin pin={controller.pin} />
                )}
                {controller.steps.active === 3 && (
                  <SetPin pin={controller.confirm} />
                )}
              </View>
            </View>
          </ScrollView>
          <Footer
            onPressBack={goBack}
            onPressNext={controller.nextStep}
            nextButtonText="Continue"
            isHideNext={controller.steps.active === 0}
            isDisableNext={!controller.isCanNext}
            style={styles.mh30}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.Dark3,
    flexGrow: 1,
    // paddingVertical: 16,
  },
  // -------- Main --------
  header: {
    marginBottom: 50,
  },
  mh30: { marginHorizontal: 30 },
  center: {
    paddingHorizontal: 30,
    flexGrow: 1,
    // paddingTop: 50,
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
  buttonContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
  },

  paste: {
    width: 65,
    marginHorizontal: 30,
    marginTop: 24,
    marginBottom: 40,
  },

  // // ----- ScrollView -------
  // scrollview: {
  //   flex: 1,
  //   marginTop: 16,
  //   marginBottom: 16,
  // },
  // scrollviewContainer: {
  //   paddingTop: 15,
  //   paddingBottom: 6,
  // },
});
