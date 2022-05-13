import { useCallback, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { COLOR } from "utils";
import { Header, Icon2 } from "components/atoms";
import { Pagination } from "components/moleculs";
import { useImportFromSeedController } from "./controllers";
import { Subtitle, Title } from "./components/atoms";
import { Footer, SetPin } from "./components/organisms";

type Props = NativeStackScreenProps<RootStackParamList, "ImportWithKeplr">;

export default observer<Props>(({ navigation, route }) => {
  const controller = useImportFromSeedController();
  useEffect(() => {
    // controller.setWallet(route.params.data);
  }, [route.params.data]);

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
});