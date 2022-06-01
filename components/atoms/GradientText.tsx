import { Text, TextProps } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import ThemedGradient from "./ThemedGradient";

type Props = TextProps;

export default (props: Props) => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <ThemedGradient>
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </ThemedGradient>
    </MaskedView>
  );
};
