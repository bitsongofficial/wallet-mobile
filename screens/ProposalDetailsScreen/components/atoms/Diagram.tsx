import { StyleProp, ViewStyle } from "react-native"
import { PieChart, PieChartData } from "react-native-svg-charts"
import { COLOR } from "utils"

type Props = {
	yes: number
	no: number
	noWithVeto: number
	abstain: number
	style?: StyleProp<ViewStyle>
}

export default ({ abstain, no, noWithVeto, yes, style }: Props) => {
	const data: PieChartData[] = [
		{
			key: "yes",
			value: yes,
			svg: { fill: COLOR.White },
		},
		{
			key: "no",
			value: no,
			svg: { fill: COLOR.RoyalBlue },
		},
		{
			key: "noWithVeto",
			value: noWithVeto,
			svg: { fill: COLOR.SlateBlue },
		},
		{
			key: "abstain",
			value: abstain,
			svg: { fill: COLOR.Dark3 },
		},
	]

	return <PieChart style={[{ height: 240 }, style]} data={data} />
}