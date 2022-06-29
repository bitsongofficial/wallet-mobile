import { Cipher } from "core/types/cryptography/Generic"
import CryptoJS from "react-native-crypto-js"

export class AESCipher implements Cipher {
	constructor(public key: string)
	{

	}
	Crypt(data: any)
	{
		return CryptoJS.AES.encrypt(JSON.stringify(data), this.key).toString()
	}
	Decrypt(cipher:string)
	{
		return JSON.parse(CryptoJS.AES.decrypt(cipher, this.key).toString(CryptoJS.enc.Utf8))
	}
}