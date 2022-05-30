import { StyleSheet, Text } from "react-native";
import React from "react";
import { useTheme } from "hooks";
import { Card } from "components/atoms";
import { IMessage } from "../../type";

type Props = {
  item: IMessage;
};

export default ({ item }: Props) => {
  const theme = useTheme();
  return (
    <Card style={styles.container}>
      <Text style={[theme.text.primary, styles.title]}>IBC Transfer</Text>
      <Text style={[theme.text.primary, styles.send]}>Send 100000</Text>
      <Text style={[theme.text.secondary, styles.about]}>
        ibc/4E5444C35610CC76FC94E7..6F84E82BF2425452 to bitsong17dmxq...u085 on
        channel-73
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#14142E",
    paddingVertical: 22,
    paddingHorizontal: 26,
  },
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
  },
  send: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,

    paddingTop: 7,
  },
  about: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 11,
    lineHeight: 14,

    paddingTop: 11,
  },
});
