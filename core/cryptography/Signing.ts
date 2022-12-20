import { AminoSignResponse, Secp256k1HdWallet, Secp256k1Wallet, serializeSignDoc, StdSignature, StdSignDoc } from "@cosmjs-rn/amino";
import { Secp256k1, Secp256k1Signature, sha256 } from "@cosmjs-rn/crypto";
import { fromBase64 } from "@cosmjs-rn/encoding";
import { escapeHTML } from "core/utils/Strings";

function getDataForADR36(data: string | Uint8Array): [string, boolean]
{
    let isADR36WithString = false
    if (typeof data === "string")
	{
		data = Buffer.from(data).toString("base64")
		isADR36WithString = true
    }
	else
	{
    	data = Buffer.from(data).toString("base64")
    }
    return [data, isADR36WithString]
}

function getADR36SignDoc(signer: string, data: string): StdSignDoc
{
    return {
		chain_id: "",
		account_number: "0",
		sequence: "0",
		fee: {
			gas: "0",
			amount: [],
		},
		msgs: [
			{
				type: "sign/MsgSignData",
				value: {
				signer,
				data,
				},
			},
		],
		memo: "",
	}
}

function makeADR36AminoSignDoc(
	signer: string,
	data: string | Uint8Array
  ): StdSignDoc {
	if (typeof data === "string") {
		data = Buffer.from(data).toString("base64")
	} else {
		data = Buffer.from(data).toString("base64")
	}
  
	return getADR36SignDoc(signer, data)
}

function signAmino(
	signer: Secp256k1Wallet | Secp256k1HdWallet,
    signerAddress: string,
    signDoc: StdSignDoc,
): Promise<AminoSignResponse>
{
	signDoc = {
		...signDoc,
		memo: escapeHTML(signDoc.memo),
	}

	return signer.signAmino(signerAddress, signDoc)
}

function aminoSignature(
	signer: Secp256k1Wallet | Secp256k1HdWallet,
    signerAddress: string,
    data: string | Uint8Array
): Promise<AminoSignResponse>
{
    let isADR36WithString: boolean;
    [data, isADR36WithString] = getDataForADR36(data)
    const signDoc = getADR36SignDoc(signerAddress, data)
	return signAmino(signer, signerAddress, signDoc)
}

export async function signArbitrary(
	signer: Secp256k1Wallet | Secp256k1HdWallet,
    signerAddress: string,
    data: string | Uint8Array
): Promise<StdSignature>
{
	return (await aminoSignature(signer, signerAddress, data)).signature
}

export function verifyArbitrary(
    signer: string,
    data: string | Uint8Array,
    signature: StdSignature): Promise<boolean>
{
	const pubKey = fromBase64(signature.pub_key.value)
	const secpSignature = Secp256k1Signature.fromFixedLength(fromBase64(signature.signature))
	const hash = sha256(serializeSignDoc(makeADR36AminoSignDoc(signer, data)))
	return Secp256k1.verifySignature(secpSignature, hash, pubKey)
}