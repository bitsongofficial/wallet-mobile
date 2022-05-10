import { StyleSheet, View } from "react-native";
import { Icon2 } from "components/atoms";
import { Pagination } from "components/moleculs";

type Props = {
  activeIndex: number;
};

export default ({ activeIndex }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Pagination count={5} acitveIndex={activeIndex} />
      </View>
      <View style={styles.center}>
        <Icon2 name="logo" size={56} />
      </View>
      <View style={styles.right} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 56,
  },
  left: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
});
