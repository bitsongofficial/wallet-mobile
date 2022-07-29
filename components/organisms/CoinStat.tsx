import {
  Image,
  ImageSourcePropType,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { COLOR, hexAlpha } from "utils";
import Coin from "classes/Coin";
import { observer } from "mobx-react-lite";
import { assets } from 'chain-registry'
import { useStore } from "hooks";
import { toJS } from "mobx";

type Props = {
  coin: Coin;
  style?: StyleProp<ViewStyle>;
};

export default observer(({ coin, style }: Props) => {
  const { settings } = useStore()
  const asset = assets.reduce((res: any[], a:any) => res.concat(a.assets), []).find((a: any)=>(a.base===coin.info.denom))
  const logo = asset && asset.logo_URIs && asset.logo_URIs.png ? asset.logo_URIs.png : undefined
  const source: ImageURISource = {uri: logo}
  const name = asset ? asset.name.replace("Fantoken", "") : "undefined"
  const display = asset ? asset.display.toUpperCase() : "Undefined"
  const balance = coin.balance.toLocaleString("en");
  const balanceUSD = coin.balanceUSD
    ? coin.balanceUSD.toLocaleString("en")
    : undefined;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <Image source={source} style={styles.image} />
      </View>

      <View style={styles.about}>
        <View style={styles.texts}>
          <Text style={styles.primary}>{name}</Text>
          <Text style={styles.secondary}>{display}</Text>
        </View>

        <View style={styles.numbers}>
          <Text style={styles.primary}>{balance}</Text>
          {balanceUSD && <Text style={styles.secondary}>{balanceUSD} {settings.currency?.symbol}</Text>}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: hexAlpha(COLOR.White, 10),
    height: 70,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
  },

  about: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    marginRight: 14,
    width: 30,
    height: 30,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  texts: {
    flex: 1,
    alignItems: "flex-start",
  },
  numbers: {
    flex: 1,
    alignItems: "flex-end",
  },
  primary: {
    color: COLOR.White,
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
  },
  secondary: {
    color: COLOR.White,
    opacity: 0.5,
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    // lineHeight: '111.1%',
  },
});
