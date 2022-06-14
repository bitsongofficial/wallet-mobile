import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function useBottomSheetBackButton(
  isOpen: boolean | undefined,
  handleClose: () => void
) {
  useEffect(() => {
    if (isOpen) {
      const handler = BackHandler.addEventListener("hardwareBackPress", () => {
        handleClose();
        return true;
      });
      return () => handler.remove();
    }
  }, [handleClose, isOpen]);
}
