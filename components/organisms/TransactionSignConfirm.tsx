import { useDimensions } from "@react-native-community/hooks";
import { Button } from "components/atoms";
import { globalBottomsheet } from "hooks/useGlobalBottomsheet";
import { StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Data } from "screens/SendModalScreens/components/organisms";
import { COLOR } from "utils";

type Props = {
	/** How many $ we will send */
	data: any;
	/** Account details from which we send */
	accept: () => void;
	/** The address we ship to */
	reject?: () => void;
}

export function TransactionSignConfirm({data, accept, reject}: Props)
{
	return (
		<>
			<Data
			style={{ marginTop: 36 }}
			json={JSON.stringify(data, null, 4)}
			/>
			<Button text="Confirm" onPress={accept}></Button>
		</>
	)
}

export const confirmTransaction = (data: any, accept: () => void, reject: () => void) => {
	const gbs = globalBottomsheet;
	const flag = {accepted: false}
    gbs.setProps({
      snapPoints: ["80%"],
      backgroundStyle: styles.background,
      android_keyboardInputMode: undefined,
      onClose: () => {
		if(!flag.accepted) reject()
	  },
      children: <TransactionSignConfirm data={data} accept={() => {
		flag.accepted = true
		accept()
		gbs.close()
	  }} />,
    });
    gbs.snapToIndex(0);
}

const styles = StyleSheet.create({
	background: {
	  backgroundColor: COLOR.Dark3,
	  paddingTop: 30,
	},
})