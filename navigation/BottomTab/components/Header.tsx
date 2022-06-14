import { Image, StyleSheet, Text, View } from "react-native";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "components/atoms";
import { COLOR } from "utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback } from "react";

export default function Header({ navigation }: BottomTabHeaderProps) {
  const insets = useSafeAreaInsets();

  const openProfile = useCallback(() => navigation.push("Profile"), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.right}>
          <Icon name="cosmo" size={40} />
        </View>
        <View style={styles.center}>
          <Text style={styles.title}>Cosmosnautico</Text>
        </View>
        <View style={styles.left}>
          <Icon name="bell" size={15} fill="#202020" />
          <TouchableOpacity onPress={openProfile}>
            <Image
              source={require("assets/images/mock/avatar.png")}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    backgroundColor: COLOR.Dark3,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "space-between",
  },
  right: {},
  center: {},
  left: {
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
  },
  avatar: {
    marginLeft: 20,
    width: 35,
    height: 35,
  },
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: COLOR.White,
  },
});
