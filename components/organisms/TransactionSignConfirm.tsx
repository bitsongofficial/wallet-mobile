import { Button } from "components/atoms";
import { gbs } from "modals";
import { navigate } from "navigation/utils";
import { StyleSheet } from "react-native";
import { Data } from "modals/wallets/components/organisms";
import { COLOR } from "utils";

type Props = {
	data: any;
	accept: () => void;
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
			<Button text="Confirm" onPress={
				() =>
				{
					navigate("Loader", {
						callback: async () =>
						{
							return await accept()
						}
					})
				}}></Button>
		</>
	)
}

export const confirmTransaction = (data: any, accept: () => void, reject: () => void) => {
	const flag = {accepted: false}
    gbs.setProps({
      snapPoints: ["80%"],
      backgroundStyle: styles.background,
      android_keyboardInputMode: undefined,
      onClose: () => {
		if(!flag.accepted) reject()
	  },
      children: <TransactionSignConfirm data={data} accept={async () => {
		flag.accepted = true
		gbs.close()
		const res = await accept()
		return res
	  }}/>,
    });
    gbs.snapToIndex(0);
}

const styles = StyleSheet.create({
	background: {
	  backgroundColor: COLOR.Dark3,
	  paddingTop: 30,
	},
})