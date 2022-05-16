import { useCallback, useRef } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { COLOR } from "utils";
import { Button, Header, Icon2, Input } from "components/atoms";
import { Pagination } from "components/moleculs";
import { Subtitle, Title } from "./components/atoms";
import { Footer, SetPin, PhraseInput } from "./components/organisms";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFooter, useImportFromSeed } from "./hooks";

type Props = NativeStackScreenProps<RootStackParamList, "ImportFromSeed">;

export default observer<Props>(({ navigation }) => {
  const controller = useImportFromSeed();
  const [goBack, goNext] = useFooter(controller.steps);

  const scrollview = useRef<ScrollView>(null);
  const scrollingEnd = useCallback(() => {
    scrollview.current?.scrollToEnd();
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
          <View style={[styles.mh30, { paddingTop: 50 }]}>
            <Title text={controller.steps.title} />
            <Subtitle style={styles.subtitle}>
              This is the only way you will be able to {"\n"}recover your
              account. Please store it {"\n"}somewhere safe!
            </Subtitle>
          </View>

          {controller.steps.active === 0 && (
            <>
              <ScrollView
                ref={scrollview}
                style={styles.scrollview}
                onContentSizeChange={scrollingEnd}
                contentContainerStyle={styles.scrollviewContent}
              >
                {/* <View style={styles.paste}>
                  <Button
                    text="Paste"
                    contentContainerStyle={styles.buttonContent}
                    textStyle={styles.buttonText}
                    onPress={controller.steps.next}
                  />
                </View> */}
                <PhraseInput phrase={controller.phrase} />
              </ScrollView>
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
                  autoFocus
                />
              )}
              {controller.steps.active === 2 && <SetPin pin={controller.pin} />}
              {controller.steps.active === 3 && (
                <SetPin pin={controller.confirm} />
              )}
            </View>
          </View>
          <Footer
            onPressBack={goBack}
            onPressNext={goNext}
            nextButtonText={
              controller.steps.active === 0 ? "Paste" : "Continue"
            }
            isHideNext={!controller.isCanNext}
            style={styles.mh30}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    flex: 1,
    borderStartColor: "green",
  },
  // -------- Main --------
  keyboardAvoiding: {
    flex: 1,
  },
  mh30: { marginHorizontal: 30 },
  center: {
    paddingHorizontal: 30,
    flexGrow: 1,
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
  scrollview: { flexGrow: 1 },
  scrollviewContent: {
    flexGrow: 1,
    paddingBottom: 16,
    paddingTop: 40,
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
    marginBottom: 24,
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
