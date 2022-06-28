import { useMemo } from "react";
import { store } from "stores/Store";

export default function useStore() {
  return useMemo(() => store, []);
}
