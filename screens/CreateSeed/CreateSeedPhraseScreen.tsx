import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLOR, hexAlpha } from "../../utils";
import { Button, ButtonBack } from "../../components/atoms";
import { Phrase } from "components/moleculs";
import { useSeedPhrase, useTheme } from "hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { Title, Subtitle } from "./components/atoms";
import Icon2 from "components/atoms/Icon2";

type Props = NativeStackScreenProps<RootStackParamList, "CreateSeed">;

export default observer<Props>(({ navigation }) => {
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

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Title>Create New Mnemonic</Title>
          <Subtitle style={styles.subtitle}>
            This is the only way you will be able to {"\n"}recover your account.
            Please store it {"\n"}somewhere safe!
          </Subtitle>

          <View style={{ marginTop: 24, width: 173 }}>
            <Button
              mode="gradient"
              contentContainerStyle={styles.buttonContent}
              // style={styles.buttonToggleOutline}
              // IconRight={
              //   <Icon name="eye" size={16} style={styles.marginRight} />
              // }
              onPress={togglePhrase}
            >
              <Text style={[styles.buttonText, theme.text.primary]}>
                Show Phrase
              </Text>
              <Icon2 name="eye" size={18} />
            </Button>
          </View>

          <ScrollView
            style={styles.scrollview}
            contentContainerStyle={styles.scrollviewContainer}
          >
            <Phrase hidden={isHidden} value={phrase} />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <ButtonBack onPress={goBack} />
            </View>

            <View style={styles.footerRight}>
              <Button
                contentContainerStyle={styles.buttonContinueContent}
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
  title: {
    color: COLOR.White,
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 25,
    marginTop: 34,
    marginBottom: 13,
  },
  subtitle: {
    marginTop: 8,
  },
});
