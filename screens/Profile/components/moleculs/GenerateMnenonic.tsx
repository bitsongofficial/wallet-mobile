import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { observer } from "mobx-react-lite";
import { useTheme } from "hooks";
import { COLOR } from "utils";
import { Phrase } from "classes";
import { Button } from "components/atoms";
import { Phrase as PhraseView } from "components/moleculs";
import { Title } from "../atoms";

type Props = {
  close?(): void;
};

export default observer<Props>(({ close }) => {
  const theme = useTheme();
  const phrase = useMemo(() => new Phrase(), []);

  const [isHidden, setHidden] = useState(true);
  const toggle = useCallback(() => setHidden((value) => !value), []);

  useEffect(() => {
    phrase.create();
  }, [phrase]);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create new Mnemonics</Title>
      <Text style={styles.caption}>
        This is the only way you will be able to{"\n"}
        recover your account.Please store it {"\n"}
        somewhere safe!
      </Text>
      <Button
        style={styles.buttonToggle}
        onPress={toggle}
        contentContainerStyle={styles.buttonToggleContainer}
      >
        Show
      </Button>
      <View style={{ height: 320, width: "100%" }}>
        <BottomSheetScrollView style={{ height: 370 }}>
          <PhraseView
            style={styles.phrase}
            hidden={isHidden}
            value={phrase.words}
          />
        </BottomSheetScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          contentContainerStyle={styles.buttonContinueContent}
          textStyle={styles.buttonContinueText}
        >
          Continue
        </Button>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,

    marginBottom: 30,
  },
  caption: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,

    textAlign: "center",
    color: COLOR.Marengo,
    marginBottom: 26,
  },

  buttonToggle: {
    marginBottom: 25,
  },
  buttonToggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  phrase: {
    alignItems: "center",
  },

  footer: {
    justifyContent: "flex-end",
    // backgroundColor: "orange",
    flexGrow: 1,
    marginTop: 30,
  },

  buttonContinueContent: {
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  buttonContinueText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
