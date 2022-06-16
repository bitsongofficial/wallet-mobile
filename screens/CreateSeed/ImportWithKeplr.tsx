import { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "types";
import { COLOR } from "utils";
import { Header, Icon2 } from "components/atoms";
import { Pagination } from "components/moleculs";
import { Subtitle, Title } from "./components/atoms";
import { Footer, SetPin } from "./components/organisms";
import { useFooter, useImportWithKeplr } from "./hooks";
import { useStore } from "hooks";

type Props = NativeStackScreenProps<RootStackParamList, "ImportWithKeplr">;

export default observer<Props>(({ navigation, route }) => {
  const {wallet} = useStore()
  const controller = useImportWithKeplr();
  const [goBack, goNext] = useFooter(controller.steps);
  useEffect(() => {
    // controller.setWallet(route.params.data);
  }, [route.params.data]);
  const save = async () =>
  {
    await wallet.importFromKeplr("keplr", route.params.data)
    goNext()
  }
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
          style={styles.header}
        />

        <View style={styles.center}>
          <View style={styles.fullSize}>
            <Title>{controller.steps.title}</Title>
            <Subtitle style={styles.subtitle}>
              This is the only way you will be able to {"\n"}recover your
              account. Please store it {"\n"}somewhere safe!
            </Subtitle>

            {controller.steps.active === 0 && <SetPin pin={controller.pin} />}
            {controller.steps.active === 1 && (
              <SetPin pin={controller.confirm} />
            )}
          </View>

          <Footer
            onPressBack={goBack}
            onPressNext={controller.steps.active === 1 ? save : goNext}
            nextButtonText="Continue"
            isHideNext={controller.isCanNext}
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
});
