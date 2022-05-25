import { StyleSheet, View } from "react-native";
import { SvgCss, XmlProps } from "react-native-svg";
import Icons from "assets/svg2/icons";
import { COLOR } from "utils";

export type IconName = keyof typeof Icons;

type Props = Omit<XmlProps, "xml" | "fill"> & {
  size?: number;
  fill?: string;
  name: IconName;
};

export default ({ size = 14, name, ...props }: Props) => {
  const style = {
    width: size,
    height: size,
  };

  const Icon = Icons[name];

  if (Icon) {
    return (
      <SvgCss {...props} {...style} xml={Icon} style={[style, props.style]} />
    );
  }
  return <View style={[styles.fake, style, props.style]} />;
};

const styles = StyleSheet.create({
  fake: {
    backgroundColor: COLOR.White,
  },
});
