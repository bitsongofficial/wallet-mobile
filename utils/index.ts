import { getRandomBytes } from "expo-random";

export { default as COLOR } from "./colors";
export { default as InputHandler } from "./InputHandler";

export const bip39 = require("../utils/bip39.browser");

export function hexAlpha(hex: string, percent: number): string {
  const str = Math.trunc((percent * 255) / 100).toString(16);
  return hex + (str.length === 2 ? str : `0${str}`);
}

export function round(v: number, num = 2) {
  return +v.toFixed(num);
}

export function sliceIntoChunks<T>(arr: T[], size: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export function getRandomValues(values: Uint8Array) {
  let randomBytes;
  try {
    // NOTE: Consider implementing `fillRandomBytes` to populate the given TypedArray directly
    randomBytes = getRandomBytes(values.byteLength);
  } catch (e) {
    // TODO: rethrow the error if it's not due to a lack of synchronous methods
    console.warn(
      `Random.getRandomBytes is not supported; falling back to insecure Math.random`
    );
    return getRandomValuesInsecure(values);
  }
  // Create a new TypedArray that is of the same type as the given TypedArray but is backed with the
  // array buffer containing random bytes. This is cheap and copies no data.
  const TypedArrayConstructor = values.constructor;

  // @ts-ignore
  const randomValues = new TypedArrayConstructor(
    randomBytes.buffer,
    randomBytes.byteOffset,
    values.length
  );
  // Copy the data into the given TypedArray, letting the VM optimize the copy if possible
  values.set(randomValues);
  return values;
}

export function getRandomValuesInsecure(values: Uint8Array) {
  // Write random bytes to the given TypedArray's underlying ArrayBuffer
  const byteView = new Uint8Array(
    values.buffer,
    values.byteOffset,
    values.byteLength
  );
  for (let i = 0; i < byteView.length; i++) {
    // The range of Math.random() is [0, 1) and the ToUint8 abstract operation rounds down
    byteView[i] = Math.random() * 256;
  }
  return values;
}
