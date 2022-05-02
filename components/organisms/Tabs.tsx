import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import ThemedGradient from "components/atoms/ThemedGradient";

type Props = {
  values: string[];
  active: string;
  onPress(value: string): void;
  style?: StyleProp<ViewStyle>;
};

export default function Tabs({ active, values, style, onPress }: Props) {
  return (
    <View style={[styles.container, style]}>
      {values.map((value, i) => (
        <TouchableOpacity key={value + i} onPress={() => onPress(value)}>
          <View style={styles.tab}>
            <Text
              style={[styles.tab_value, value !== active && styles.tab_active]}
            >
              {value}
            </Text>
            {value === active && <ThemedGradient style={styles.marker} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  marker: {
    borderRadius: 4,
    height: 9,
    marginTop: 5,
  },

  tab: {
    marginRight: 30,
  },
  tab_value: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,

    color: "#FFFFFF",
  },
  tab_active: {
    opacity: 0.3,
  },
});
