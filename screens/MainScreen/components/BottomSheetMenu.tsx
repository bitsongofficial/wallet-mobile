import { forwardRef, Ref } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "components/atoms";
import { ToolbarAction } from "components/organisms";
import { useTheme } from "hooks";
import { observer } from "mobx-react-lite";
import { BottomSheet } from "components/moleculs";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheetProps } from "@gorhom/bottom-sheet";

type Props = Omit<BottomSheetProps, "children">;

export default observer(
  forwardRef(function BottomSheetMenu(
    { ...props }: Props,
    ref: Ref<BottomSheetMethods>
  ) {
    const theme = useTheme();
    console.log("BottomSheetMenu :>> ", ref);
    return (
      <BottomSheet {...props} ref={ref}>
        <View style={{ padding: 24 }}>
          <Text style={[styles.title, theme.text.primary]}>Quick actions</Text>
          <View style={styles.row}>
            <ToolbarAction
              title="Send"
              mode="gradient"
              Icon={<Icon name="arrow_up" />}
              size={65}
            />
            <ToolbarAction
              title="Receive"
              Icon={<Icon name="arrow_down" />}
              size={65}
            />
            <ToolbarAction
              title="Inquire"
              Icon={<Icon name="tip" />}
              size={65}
            />
            <ToolbarAction
              title="Scan"
              Icon={<Icon name="qr_code" />}
              size={65}
            />
          </View>
          <View style={styles.row}>
            <ToolbarAction
              title="Claim"
              mode="gradient"
              Icon={<Icon name="arrow_up_border" />}
              size={65}
            />
            <ToolbarAction
              title="Stake"
              Icon={<Icon name="stake" />}
              size={65}
            />
            <ToolbarAction
              title="Unstake"
              Icon={<Icon name="unstake" />}
              size={65}
            />
            <ToolbarAction
              title="Restake"
              Icon={<Icon name="unstake" />}
              size={65}
            />
          </View>
          <View style={styles.row}>
            <ToolbarAction title="Issue" size={65} />
            <ToolbarAction title="Mint" size={65} />
            <ToolbarAction title="Burn" size={65} />
            <ToolbarAction nullContent size={65} />
          </View>
        </View>
      </BottomSheet>
    );
  })
);

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
