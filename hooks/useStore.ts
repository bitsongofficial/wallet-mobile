import { useMemo } from "react";
import MainStore from "../stores/MainStore";

const store = new MainStore();

export default function useStore() {
  return useMemo(() => store, []);
}
