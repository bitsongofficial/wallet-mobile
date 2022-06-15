import { useCallback } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { COLOR, hexAlpha } from "utils";
import { Icon2 } from "components/atoms";
import { StoreWallet } from "stores/WalletStore";

type Props = {
  wallet: StoreWallet | null;
  onPress(wallet: StoreWallet): void;
  style?: StyleProp<ViewStyle>;
};

export default ({ onPress, wallet, style }: Props) => {
  const handlePress = useCallback(() => onPress(wallet), [onPress, wallet]);
  return (
    <RectButton onPress={handlePress} style={style}>
      <View style={styles.container}>
        <Icon2
          size={18}
          name="wallet"
          stroke={hexAlpha(COLOR.White, 20)}
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{wallet?.data.name}</Text>
          <Text style={styles.address}>bitsong1id02h0c...2029d</Text>
        </View>
        <Icon2 size={13} name="chevron_down" stroke={COLOR.RoyalBlue} />
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 73,
    backgroundColor: COLOR.Dark3,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { marginRight: 16 },
  info: { flex: 1 },
  name: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: COLOR.White,
  },
  address: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
    color: COLOR.RoyalBlue4,
  },
});
