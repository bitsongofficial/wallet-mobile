import { useMemo } from "react";
import {
  CreateWalletController,
  ImportFromSeedController,
  ImportWithKeplrController,
} from "../controllers";

export function useCreateWallet() {
  return useMemo(() => new CreateWalletController(), []);
}

export function useImportFromSeed() {
  return useMemo(() => new ImportFromSeedController(), []);
}

export function useImportWithKeplr() {
  return useMemo(() => new ImportWithKeplrController(), []);
}
