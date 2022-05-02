import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Icon } from "components/atoms";
import { ToolbarAction } from "components/organisms";
import { useTheme } from "hooks";
import { observer } from "mobx-react-lite";
import { ViewProps } from "components/Themed";

type Props = {
  onPressSend?(): void;
  onPressReceive?(): void;
  onPressInquire?(): void;
  onPressScan?(): void;
  onPressClaim?(): void;
  onPressStake?(): void;
  onPressUnstake?(): void;
  onPressRestake?(): void;
  onPressIssue?(): void;
  onPressMint?(): void;
  onPressBurn?(): void;
  style: StyleProp<ViewStyle>;
};

export default observer(function BottomSheetMenu({
  onPressSend,
  onPressReceive,
  onPressInquire,
  onPressScan,
  onPressClaim,
  onPressStake,
  onPressUnstake,
  onPressRestake,
  onPressIssue,
  onPressMint,
  onPressBurn,
  style,
}: Props) {
  const theme = useTheme();
  return (
    <View style={style}>
      <Text style={[styles.title, theme.text.primary]}>Quick actions</Text>
      <View style={styles.row}>
        <ToolbarAction
          onPress={onPressSend}
          title="Send"
          mode="gradient"
          Icon={<Icon name="arrow_up" />}
          size={65}
        />
        <ToolbarAction
          onPress={onPressReceive}
          title="Receive"
          Icon={<Icon name="arrow_down" />}
          size={65}
        />
        <ToolbarAction
          onPress={onPressInquire}
          title="Inquire"
          Icon={<Icon name="tip" />}
          size={65}
        />
        <ToolbarAction
          onPress={onPressScan}
          title="Scan"
          Icon={<Icon name="qr_code" />}
          size={65}
        />
      </View>
      <View style={styles.row}>
        <ToolbarAction
          onPress={onPressClaim}
          title="Claim"
          mode="gradient"
          Icon={<Icon name="arrow_up_border" />}
          size={65}
        />
        <ToolbarAction
          onPress={onPressStake}
          title="Stake"
          Icon={<Icon name="stake" />}
          size={65}
        />
        <ToolbarAction
          onPress={onPressUnstake}
          title="Unstake"
          Icon={<Icon name="unstake" />}
          size={65}
        />
        <ToolbarAction
          onPress={onPressRestake}
          title="Restake"
          Icon={<Icon name="unstake" />}
          size={65}
        />
      </View>
      <View style={styles.row}>
        <ToolbarAction onPress={onPressIssue} title="Issue" size={65} />
        <ToolbarAction onPress={onPressMint} title="Mint" size={65} />
        <ToolbarAction onPress={onPressBurn} title="Burn" size={65} />
        <ToolbarAction nullContent size={65} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 23,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 38,
  },
});
