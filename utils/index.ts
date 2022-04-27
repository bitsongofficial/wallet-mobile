export function hexAlpha(hex: string, percent: number): string {
  const str = Math.trunc((percent * 255) / 100).toString(16);
  return hex + (str.length === 2 ? str : `0${str}`);
}
