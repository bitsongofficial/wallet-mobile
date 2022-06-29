import { StyleSheet, View } from "react-native";
import { useTheme } from "hooks";
import { PropsWithChildren } from "react";
import { COLOR } from "utils";

type Props = {
	showing?: boolean,
	children?: React.ReactNode,
};

export default ({ children, showing }:Props) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, {position: showing ? "absolute" : "relative", display: showing ? "flex" : "none"}]}>
      {children}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
	opacity: 0.85,
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	zIndex: 100,
	flex: 1,
  },
});
