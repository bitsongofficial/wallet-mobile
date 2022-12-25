import { t } from "i18next";
import { gbs } from "modals";
import { Connectors } from "stores/DappConnectionStore";
import { BottomSheetView } from "@gorhom/bottom-sheet"
import HorizontalWrapper from "screens/layout/HorizontalWrapper";
import { SelectBase } from "modals/general/organisms";
import { enumValues } from "utils/enums";
import { ListRenderItem, StyleSheet } from "react-native";
import { ListItem } from "components/moleculs";
import { s } from "react-native-size-matters";

export default function openSelectConnector(onConnectorSelect: ((connector: Connectors) => void))
{
	const renderFunction: ListRenderItem<Connectors> = ({item}) =>
	{
		let title = t("BitsongJSConnector")
		switch(item)
		{
			case Connectors.Keplr:
				title = t("KeplrConnector")
				break
		}
		return <ListItem
			title={title}
		/>
	}
	const select = (item: Connectors) =>
	{
		gbs.close()
		onConnectorSelect(item)
	}
	gbs.backHandler = () =>
	{
		gbs.close()
	}
	gbs.setProps({
		snapPoints: ["44%"],
		onChange(index) {
			if (index === -1) {
				gbs.removeBackHandler()
			}
		},
		children: () => (
			<BottomSheetView style={[styles.container, styles.minFullHeight]}>
				<HorizontalWrapper style={styles.minFullHeight}>
					<SelectBase
						items={enumValues(Connectors)}
						title={t("ConnectorsSelect")}
						renderFunction={renderFunction}
						onPress={select}
					></SelectBase>
				</HorizontalWrapper>
			</BottomSheetView>
		),
	})
	requestAnimationFrame(() => gbs.expand())
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: s(8),
	},
	minFullHeight: {
		minHeight: "100%",
	},
})