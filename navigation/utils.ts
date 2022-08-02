import { NavigationContainerRef } from "@react-navigation/native";
import { createRef } from "react";
import { RootStackParamList } from "types";

export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>()

export function getMainNavigation()
{
  return navigationRef.current ? navigationRef.current : undefined
}

export function navigate(name: keyof RootStackParamList, params?:any) {
  navigationRef.current?.navigate<keyof RootStackParamList>(name, params);
}