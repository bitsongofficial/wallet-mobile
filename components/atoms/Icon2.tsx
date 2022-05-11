import { StyleSheet, View } from "react-native";
import { SvgCss, XmlProps } from "react-native-svg";
import Icons from "assets/svg2/icons";

type Props = Omit<XmlProps, "xml" | "fill"> & {
  size?: number;
  fill?: string;
  name: keyof typeof Icons;
};

export default ({ size = 14, name, fill, ...props }: Props) => {
  const style = {
    width: size,
    height: size,
  };

  const Icon = Icons[name];

  if (Icon) {
    return (
      <SvgCss
        {...props}
        {...style}
        fill={fill}
        xml={Icon}
        style={[style, props.style]}
      />
    );
  }
  return (
    <View
      style={[
        styles.fake,
        style,
        fill !== undefined ? { backgroundColor: fill } : undefined,
        props.style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  fake: {
    backgroundColor: "white",
  },
});