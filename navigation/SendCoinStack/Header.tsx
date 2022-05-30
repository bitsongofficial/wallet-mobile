import { StyleSheet, Text, View } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";
import { useTheme } from "hooks";

type Props = NativeStackHeaderProps;

export default observer<Props>(function Header(props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, theme.text.primary]}>Send</Text>
      <Text style={[styles.caption, theme.text.secondary]}>
        {props.options.title}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 21,
    lineHeight: 27,
  },
  caption: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
  },
  container: {
    marginTop: 13,
    marginHorizontal: 33,
  },
});
