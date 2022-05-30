export type SendCoinStackParamList = {
  SelectReceiver: undefined;
  InsertImport: undefined;
  SelectCoin: undefined;
  SendRecap: undefined;
  ScannerQR: { onBarCodeScanned(data: string): void };
};
