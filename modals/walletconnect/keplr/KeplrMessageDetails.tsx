import { StyleSheet, Text, View } from 'react-native'
import { AminoMsg } from '@cosmjs-rn/amino'
import JSONTree from 'react-native-json-tree'
import { useTheme } from 'hooks'
import { ButtonBack } from 'components/atoms'
import { s } from 'react-native-size-matters'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {
	goBack?: () => void
	msg: AminoMsg
}

export default function KeplrMessageDetails({msg, goBack}: Props) {
	const theme = useTheme()
	return (
		<View style={styles.fullHeight}>
		{goBack && <ButtonBack style={styles.bottomMargin} onPress={goBack}></ButtonBack>}
			<ScrollView>
				<JSONTree data={{...msg}} theme={theme.jsonTheme} invertTheme={false}></JSONTree>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	bottomMargin: {
		marginBottom: s(10)
	},
	fullHeight: {
		height: "100%",
	},
})