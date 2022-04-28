import React from "react";
import { SvgCss, XmlProps } from "react-native-svg";
// import {COLOR} from '../../utils';
import icons from "assets/svg";
import { StyleSheet, View } from "react-native";

type Props = Omit<XmlProps, "xml" | "fill"> & {
  size?: number;
  fill?: string;
  name: keyof typeof icons;
};
export default ({ size = 14, name, fill, ...props }: Props) => {
  const style = {
    width: size,
    height: size,
  };
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
  // return (
  //   <SvgCss
  //     {...props}
  //     {...style}
  //     xml={icons[name]}
  //     style={[style, props.style]}
  //   />
  // );
};

const styles = StyleSheet.create({
  fake: {
    backgroundColor: "white",
  },
});
