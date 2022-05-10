import { Store } from "core/types/storing/Generic";
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStore implements Store {
	constructor(public field:string){}
	async Get()
	{
		return JSON.parse(await AsyncStorage.getItem(this.field) ?? "")
	}
	async Set(data: any)
	{
		try
		{
			await AsyncStorage.setItem(this.field, JSON.stringify(data))
			return true
		}
		catch(e)
		{
			return false
		}
	}
	
}