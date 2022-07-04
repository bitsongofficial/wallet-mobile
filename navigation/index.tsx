/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  NavigationContainerRef,
} from "@react-navigation/native";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import LinkingConfiguration from "./LinkingConfiguration";
import RootStack from "./RootStack";
import { navigationRef } from "./utils";

type Props = {
  colorScheme: ColorSchemeName;
};

export default function Navigation({ colorScheme }: Props) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      // TODO: remove
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      ref={navigationRef}
    >
      <RootStack />
    </NavigationContainer>
  );
}
