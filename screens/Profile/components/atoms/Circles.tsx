import { View } from "react-native"
import { hexAlpha } from "utils"

type Props = {
	children: React.ReactNode
}

export default ({ children }: Props) => (
	<Circle size={300} opacity={0.1}>
		<Circle size={200} opacity={0.3}>
			<Circle size={150} opacity={0.5}>
				{children}
			</Circle>
		</Circle>
	</Circle>
)

type CircleProps = {
	children: React.ReactNode
	size: number
	opacity?: number
}

const Circle = ({ children, size, opacity = 1 }: CircleProps) => (
	<View
		style={{
			width: size,
			height: size,
			borderRadius: size,
			backgroundColor: hexAlpha("#737ae2", opacity * 100),
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		{children}
	</View>
)
