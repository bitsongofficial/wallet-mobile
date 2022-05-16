import { Dot } from "components/atoms";
import { StyleSheet, View } from "react-native";

type PaginationProps = {
  acitveIndex: number;
  count: number;
};

export default ({ count, acitveIndex }: PaginationProps) => {
  return (
    <View style={styles.container}>
      {new Array(count).fill(null).map((_, index) => (
        <Dot key={index} active={index === acitveIndex} style={styles.dot} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  dot: { marginRight: 4 },
});
