import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Icon2 } from "components/atoms";
import { Phrase } from "components/moleculs";
import { useTheme } from "hooks";
import { Subtitle, Title } from "../atoms";

type Props = {
  isHidden: boolean;
  onPressToggle(): void;
  phrase: string[];
};

export default ({ isHidden, phrase, onPressToggle }: Props) => {
  const theme = useTheme();
  return (
    <>
      <Title>Create New Mnemonic</Title>
      <Subtitle style={styles.subtitle}>
        This is the only way you will be able to {"\n"}recover your account.
        Please store it {"\n"}somewhere safe!
      </Subtitle>

      <View style={styles.containerToggle}>
        <Button
          mode="gradient"
          contentContainerStyle={styles.buttonContent}
          // style={styles.buttonToggleOutline}
          // IconRight={
          //   <Icon name="eye" size={16} style={styles.marginRight} />
          // }
          onPress={onPressToggle}
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
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 8,
  },
  containerToggle: {
    marginTop: 24,
    width: 173,
  },
  buttonContent: {
    paddingVertical: 13,
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
