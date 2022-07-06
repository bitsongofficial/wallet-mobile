import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Icon2 } from "components/atoms";
import { ToolbarAction } from "components/organisms";
import { useTheme } from "hooks";
import { observer } from "mobx-react-lite";
import { COLOR } from "utils";

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

export default observer(function ToolbarFull({
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
          Icon={<Icon2 size={18} stroke={COLOR.White} name="arrow_up" />}
          size={65}
        />
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Receive"
          onPress={onPressReceive}
          Icon={<Icon2 size={18} stroke={COLOR.White} name="arrow_down" />}
          size={65}
        />
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Inquire"
          Icon={<Icon2 size={18} stroke={COLOR.White} name="inquire" />}
          size={65}
        />
        <ToolbarAction
          onPress={onPressScan}
          backgroundStyle={styles.actionBackground}
          title="Scan"
          Icon={<Icon2 size={18} stroke={COLOR.White} name="scan" />}
          size={65}
        />
      </View>
      <View style={styles.row}>
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Claim"
          Icon={<Icon2 size={18} stroke={COLOR.White} name="claim" />}
          size={65}
        />
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Stake"
          Icon={<Icon2 size={18} stroke={COLOR.White} name="stake" />}
          size={65}
        />
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Unstake"
          Icon={<Icon2 size={18} stroke={COLOR.White} name="unstake" />}
          size={65}
        />
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Restake"
          Icon={<Icon2 size={18} stroke={COLOR.White} name="restake" />}
          size={65}
        />
      </View>
      <View style={styles.row}>
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Issue"
          size={65}
        />
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Mint"
          size={65}
        />
        <ToolbarAction
          backgroundStyle={styles.actionBackground}
          title="Burn"
          size={65}
        />

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
  actionBackground: {
    backgroundColor: COLOR.Dark3,
  },
});
