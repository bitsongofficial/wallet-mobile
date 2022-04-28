import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "hooks/useTheme";

type Props = {
  values: string[];
  active: string;
  onPress(value: string): void;
  style?: StyleProp<ViewStyle>;
};

export default function Tabs({ active, values, style, onPress }: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      {values.map((value, i) => (
        <TouchableOpacity onPress={() => onPress(value)}>
          <View style={styles.tab}>
            <Text
              key={value + i}
              style={[styles.tab_value, value === active && styles.tab_active]}
            >
              {value}
            </Text>
            {value === active && (
              <LinearGradient
                style={[styles.marker, theme.gradient_style]}
                colors={theme.gradient_colors}
              />
            )}
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
    opacity: 0.3,
  },
  tab_active: {
    opacity: undefined,
  },
});
