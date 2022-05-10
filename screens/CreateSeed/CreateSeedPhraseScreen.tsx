import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLOR, hexAlpha } from "utils";
import { Button, ButtonBack, Icon } from "components/atoms";
import { useSeedPhrase, useTheme } from "hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import Icon2 from "components/atoms/Icon2";
import { Header, WalletName, SetPin, CreateSeed } from "./components/organisms";

type Props = NativeStackScreenProps<RootStackParamList, "CreateSeed">;

const defaultPin = new Array(7).fill(null);

const steps = [
  "Create New Mnemonic",
  "Name Your Wallet",
  "Set PIN",
  "Confirm PIN",
];

export default observer<Props>(({ navigation, route }) => {
  // const biometric = useBiometric();
  const phrase = useSeedPhrase();

  // const [modal, open, close] = useModal();

  const [isHidden, setHidden] = useState(true);
  // useEffect(() => setHidden(!biometric.access), [biometric.access]);

  // const onError = (error: any) => console.log("error", error);
  // const checkAccess = async () => {
  //   if (await biometric.check()) {
  //     biometric.authenticate().then(close).catch(onError);
  //     open();
  //   } else {
  //     open();
  //   }
  // };

  const togglePhrase = useCallback(
    async () => setHidden((value) => !value),
    []
  );

  const theme = useTheme();

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const [pin, setPin] = useState<any[]>(defaultPin);
  const [confirm, setConfirm] = useState<any[]>(defaultPin);

  const pushPin = useCallback((value: string) => {}, []);
  const pushConfirm = useCallback((value: string) => {}, []);

  const [activeIndex, setActiveIndex] = useState(1);
  const increment = useCallback(() => setActiveIndex((value) => value + 1), []);
  const decrement = useCallback(() => setActiveIndex((value) => value - 1), []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <Header activeIndex={activeIndex} />
        <View style={styles.center}>
          {/* <CreateSeed
            isHidden={isHidden}
            phrase={phrase}
            onPressToggle={togglePhrase}
          /> */}
          {/* <WalletName /> */}
          {/* <SetPin onPress={pushConfirm} pin={pin} /> */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <ButtonBack onPress={decrement} />
            </View>

            <View style={styles.footerRight}>
              <Button
                contentContainerStyle={styles.buttonContinueContent}
                onPress={increment}
                // onPress={open}
                // disable={!biometric.access}
                // IconRight={<Icon name="arrow_r" size={10} />}
              >
                <Text style={[styles.buttonText, theme.text.primary]}>
                  Continue
                </Text>
                <Icon2 name="chevron_right" size={18} />
              </Button>
            </View>
          </View>
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
  icon: {
    marginRight: 18,
  },
  toggle: {
    marginTop: 22,
    width: "55%",
  },

  rotate: {
    transform: [{ rotate: "180deg" }],
  },
  marginRight: {
    marginLeft: 13,
  },

  buttonContainer: {},
  buttonContent: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  buttonContinueContent: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  buttonText: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },

  buttonToggle: {
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 23,
  },
  buttonToggleOutline: {
    borderRadius: 25,
    paddingVertical: 12,
    width: 173,
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
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: { flex: 2, marginRight: 16 },
  footerRight: { flex: 2 },

  overlay: {
    paddingHorizontal: 27,
    flex: 1,
    justifyContent: "center",
    backgroundColor: hexAlpha(COLOR.Dark2, 60),
  },
  // ------ Text -------

  subtitle: {
    marginTop: 8,
  },
});
