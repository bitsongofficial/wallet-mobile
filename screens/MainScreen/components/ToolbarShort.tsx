import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Icon } from "components/atoms";
import { ToolbarAction } from "components/organisms";
import { observer } from "mobx-react-lite";

type Props = {
  onPressSend?(): void;
  onPressReceive?(): void;
  onPressInquire?(): void;
  onPressScan?(): void;
  onPressAll?(): void;
  style: StyleProp<ViewStyle>;
};

export default observer(function BottomSheetMenu({
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
        Icon={<Icon name="arrow_up" />}
      />
      <ToolbarAction
        title="Receive"
        onPress={onPressReceive}
        Icon={<Icon name="arrow_down" />}
      />
      <ToolbarAction
        title="Inquire"
        onPress={onPressInquire}
        Icon={<Icon name="tip" />}
      />
      <ToolbarAction
        title="Scan"
        onPress={onPressScan}
        Icon={<Icon name="qr_code" />}
      />
      <ToolbarAction
        title="All"
        onPress={onPressAll}
        mode="gradient"
        Icon={<Icon name="meatballs" />}
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
    backgroundColor: "#14142e",
  },
});
