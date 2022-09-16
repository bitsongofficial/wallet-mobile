import { StyleProp, ViewStyle } from "react-native"
import { s } from "react-native-size-matters"
import { PieChart, PieChartData } from "react-native-svg-charts"
import { COLOR } from "utils"

type Props = {
	yes: number
	no: number
	noWithZero: number
	abstain: number
	style?: StyleProp<ViewStyle>
}

export default ({ abstain, no, noWithZero, yes, style }: Props) => {
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
			key: "noWithZero",
			value: noWithZero,
			svg: { fill: COLOR.SlateBlue },
		},
		{
			key: "abstain",
			value: abstain,
			svg: { fill: COLOR.Dark3 },
		},
	]

	return <PieChart style={[{ height: s(240) }, style]} data={data} />
}
