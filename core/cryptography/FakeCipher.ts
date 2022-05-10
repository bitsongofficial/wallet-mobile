import { Cipher } from "core/types/cryptography/Generic"

export class FakeCipher implements Cipher {
	Crypt(data: any)
	{
		return data
	}
	Decrypt(cipher:string)
	{
		return cipher
	}
}