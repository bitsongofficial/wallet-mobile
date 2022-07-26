import * as Keychain from 'react-native-keychain'

export const isBiometricAvailable = async () => {
	return (await Keychain.getSupportedBiometryType() != null)
}

export const isPinSaved = async () => {
	return (await getPin() != false)
}

export const clearPin = async () => {
	try
	{
		return await Keychain.resetGenericPassword()
	}
	catch
	{
		return false
	}
}

export const savePin = async (pin: string) => {
	try
	{
		const res = await Keychain.setGenericPassword("pin", pin, {
			accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
		})

		if(res) return true
	}
	catch(e)
	{
		return false
	}
	return false
}

export const getPin = async () => {
	try
	{
		const credentials = await Keychain.getGenericPassword({
			accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY
		})

		if(credentials)
		{
			return credentials.password
		}
	}
	catch(e)
	{
		return false
	}
	return false
}