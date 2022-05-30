export interface Cipher {
	Crypt(data: any): string,
	Decrypt(cipher: string): any,
}