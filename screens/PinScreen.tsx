import { useCallback, useEffect, useState } from "react";
import { BackHandler, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { COLOR, hexAlpha } from "utils";
import { Header, Icon2, Input } from "components/atoms";
import { Subtitle, Title } from "./CreateSeed/components/atoms";
import { SetPin } from "./CreateSeed/components/organisms";
import { Footer } from "./SendModalScreens/components/atoms"
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import { Pin } from "classes";
import { navigate } from "navigation";

type Props = NativeStackScreenProps<RootStackParamList, "PinRequest">;

export function askPin() {
  const req = new Promise<string>((resolve, reject) =>
  {
    navigate("PinRequest", {resolve, reject})
  })

  return req
}

export default observer<Props>(({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState(new Pin())

  const goBack = useCallback(
    () => (navigation.goBack()),
    []
  );

  const confirm = useCallback(() =>
  {
    route.params.resolve(pin.value)
    goBack()
  }
  ,[])

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      route.params.reject("Rejected");
      goBack()
      return true;
    });
    return () => handler.remove();
  }, [goBack])

  return (
    <>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-insets.bottom}
      >
        <SafeAreaView style={styles.container}>
          <Header
            Center={<Icon2 name="logo" size={56} />}
          />
          <>
            <View>
              <Title text="Insert pin" style={styles.title} />
              <Subtitle style={styles.subtitle}>
                Insert your pin to unlock and confirm the operation
              </Subtitle>
            </View>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollviewContent}
            >
              <SetPin pin={pin} />
            </ScrollView>

            <Footer
              isShowBack={false}
              onPressCenter={confirm}
              centerTitle="Confirm"
            />
          </>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    paddingHorizontal: 30,
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
  title: { marginTop: 50 },
  subtitle: {
    marginTop: 8,
  },
  toggle: {
    marginTop: 24,
    width: 173,
  },
});
