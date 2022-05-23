/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  // Before  Auth
  Start: undefined;
  CreateWallet: undefined;
  ImportFromSeed: undefined;
  ImportWithKeplr: { data: string };

  // Common
  ScannerQR: { onBarCodeScanned(data: string): void };

  // After Auth
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  SendDetailsFull: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  MainTab: undefined;
  StackingTab: undefined;
  Tab1: undefined;
  Tab2: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
