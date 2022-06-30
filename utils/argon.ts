import uuid from 'react-native-uuid';
import argon2 from 'react-native-argon2'

export async function argon2Encode(data:string)
{
	const salt = uuid.v4()
    const { encodedHash } = await argon2(data, salt, {})
	return encodedHash
}

export async function argon2Verify(data:string, encodedHash:string)
{
	let salt = encodedHash.substring(0, encodedHash.lastIndexOf("$"))
	salt = salt.substring(salt.lastIndexOf("$") + 1, salt.length)
	const s = Buffer.from(salt, "base64").toString("utf-8")
	const res = await argon2(data, s, {})
	return res.encodedHash == encodedHash
}