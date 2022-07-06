import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Icon2 } from "components/atoms";
import { ToolbarAction } from "components/organisms";
import { observer } from "mobx-react-lite";
import { COLOR } from "utils";

type Props = {
  onPressSend?(): void;
  onPressReceive?(): void;
  onPressInquire?(): void;
  onPressScan?(): void;
  onPressAll?(): void;
  style: StyleProp<ViewStyle>;
};

export default observer(function ToolbarShort({
  onPressSend,
  onPressReceive,
  onPressInquire,
  onPressScan,
  onPressAll,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <ToolbarAction
        title="Send"
        onPress={onPressSend}
        mode="gradient"
        Icon={<Icon2 stroke={COLOR.White} size={18} name="arrow_up" />}
      />
      <ToolbarAction
        title="Receive"
        onPress={onPressReceive}
        Icon={<Icon2 stroke={COLOR.White} size={18} name="arrow_down" />}
      />
      <ToolbarAction
        title="Inquire"
        Icon={<Icon2 stroke={COLOR.White} size={18} name="inquire" />}
      />
      <ToolbarAction
        title="Scan"
        onPress={onPressScan}
        Icon={<Icon2 stroke={COLOR.White} size={18} name="scan" />}
      />
      <ToolbarAction
        title="All"
        onPress={onPressAll}
        mode="gradient"
        Icon={<Icon2 stroke={COLOR.White} size={18} name="settings" />}
        iconContainerStyle={styles.dark}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dark: {
    backgroundColor: COLOR.Dark3,
  },
});
