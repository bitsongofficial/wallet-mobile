import { Bech32 } from "@cosmjs-rn/encoding"

export const isValidAddress = (address: string, requiredPrefix?: string): boolean => {
	try {
	  const { prefix, data } = Bech32.decode(address);
  
	  if (requiredPrefix && prefix !== requiredPrefix) {
		return false;
	  }
  
	  return data.length === 20;
	} catch {
	  return false;
	}
  }