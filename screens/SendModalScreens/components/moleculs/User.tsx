import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLOR, hexAlpha } from "utils";
import { useTheme } from "hooks";
import { IPerson } from "classes/types";

type Props = {
  user: IPerson;
};

export default function User({ user }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.placeholder} />
      </View>
      <Text style={[styles.name, theme.text.primary]}>
        {user.firstName}. {user.lastName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  avatarContainer: {
    width: 73,
    height: 73,
    borderRadius: 73,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: hexAlpha(COLOR.White, 5),
  },
  placeholder: {
    width: 57,
    height: 57,
    borderRadius: 57,
    backgroundColor: "grey",
  },
  name: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
    marginTop: 9,
  },
});
