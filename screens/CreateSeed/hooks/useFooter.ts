import { useNavigation } from "@react-navigation/native";
import { Steps } from "classes";
import { useCallback } from "react";

export default function useFooter(steps: Steps) {
  const navigation = useNavigation();

  const goBack = useCallback(
    () => (steps.active > 0 ? steps.prev() : navigation.goBack()),
    [navigation, steps.active]
  );

  const goNext = useCallback(
    () =>
      steps.active < steps.titles.length - 1
        ? steps.next()
        : navigation.reset({ index: 0, routes: [{ name: "Root" }] }),
    [navigation, steps.active]
  );

  return [goBack, goNext] as const;
}
