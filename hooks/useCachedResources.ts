import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useEffect, useState } from "react";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await Promise.all([
          Font.loadAsync({
            ...FontAwesome.font,
            "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
            // TODO: add all suffix Weight and Style
            CircularStd: require("../assets/fonts/CircularStd-Medium.ttf"),
            "Courier Prime": require("../assets/fonts/CircularStd-Medium.ttf"),
          }),
        ]);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
