import { StyleSheet, Text } from "react-native";
import { Button, Icon2 } from "components/atoms";
import { useTheme } from "hooks";

type Props = {
  isHidden: boolean;
  onPress(): void;
};

export default ({ isHidden, onPress }: Props) => {
  const theme = useTheme();
  return (
    <Button
      mode="gradient"
      contentContainerStyle={styles.content}
      // style={styles.buttonToggleOutline}
      // IconRight={
      //   <Icon name="eye" size={16} style={styles.marginRight} />
      // }
      onPress={onPress}
    >
      <Text style={[styles.text, theme.text.primary]}>Show Phrase</Text>
      <Icon2 name="eye" size={18} />
    </Button>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
});
