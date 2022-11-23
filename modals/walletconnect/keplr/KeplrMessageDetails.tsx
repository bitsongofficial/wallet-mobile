import { StyleSheet, Text, View } from 'react-native'
import { AminoMsg } from '@cosmjs-rn/amino'
import JSONTree from 'react-native-json-tree'
import { useTheme } from 'hooks'
import { ButtonBack } from 'components/atoms'
import { s } from 'react-native-size-matters'

type Props = {
	goBack?: () => void
	msg: AminoMsg
}

export default function KeplrMessageDetails({msg, goBack}: Props) {
	const theme = useTheme()
	return (
		<View>
			{goBack && <ButtonBack style={styles.bottomMargin} onPress={goBack}></ButtonBack>}
			<JSONTree data={{...msg}} theme={theme.jsonTheme} invertTheme={false}></JSONTree>
		</View>
	)
}

const styles = StyleSheet.create({
	bottomMargin: {
		marginBottom: s(10)
	}
})