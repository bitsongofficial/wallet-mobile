/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {
  BottomTabHeaderProps,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

type LoaderParams<
  T extends any = any,
  A extends any[] = any[],
  F = (...args: A) => Promise<T>
> = {
  callback: F;
  onSucceess?(result: T): void;
  onError?(error: unknown): void;
  header?: (
    props: NativeStackHeaderProps | BottomTabHeaderProps
  ) => React.ReactNode;
};

export type RootStackParamList = {
  // Before  Auth
  Splash: undefined;
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
  SettingsSecurity: undefined;
  SettingsNotifications: undefined;
  WalletConnect: undefined;
  AddressBook: undefined;

  Loader: LoaderParams | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  MainTab: undefined;
  StackingTab: undefined;
  Tab1: undefined;
  Tab2: undefined;

  Loader: LoaderParams | undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
