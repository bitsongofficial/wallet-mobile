import { StatusBar } from "expo-status-bar";
import { ComponentType } from "react";
import { PropsWithChildren, PropsWithRef } from "react";
import { RefreshControlProps } from "react-native";
import BottomNavigator from "./BottomNavigator";
import FullHeight from "./FullHeight";
import MinFull from "./MinFull";
import Scroll from "./Scroll";
import Standard from "./Standard";

type RefreshControl = React.ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>>

export function withStandard(Component: React.FC<any>)
{
	return function(props: PropsWithChildren<any> & PropsWithRef<any>) 
	{
		return (
			<Standard>
				<Component {...props}></Component>
			</Standard>
		)
	}
}

export function withFullHeight(Component: React.FC<any>, horizontalPadding: boolean = true)
{
	return function(props: PropsWithChildren<any> & PropsWithRef<any>) 
	{
		return (
			<FullHeight horizontalPadding={horizontalPadding}>
				<Component {...props}></Component>
			</FullHeight>
		)
	}
}

export function withMinFull(Component: React.FC<any>)
{
	return function(props: PropsWithChildren<any> & PropsWithRef<any>)
	{
		return (
			<MinFull>
				<Component {...props}></Component>
			</MinFull>
		)
	}
}

export function withScroll(Component: React.FC<any>)
{
	return function(props: PropsWithChildren<any> & PropsWithRef<any>)
	{
		return (
			<Scroll>
				<Component {...props}></Component>
			</Scroll>
		)
	}
}

export function withStatusBar(Component: ComponentType<any>)
{
	return function(props: PropsWithChildren<any> & PropsWithRef<any>) 
	{
		return (
			<>
				<StatusBar style="light"></StatusBar>
				<Component {...props}></Component>
			</>
		)
	}
}

export function withStatusBarStandard(Component: React.FC<any>)
{
	return withStatusBar(withStandard(Component))
}

export function withStatusBarFullHeight(Component: React.FC<any>)
{
	return withStatusBar(withFullHeight(Component))
}

export function withBottomNavigator(Component: React.FC, RefreshControlComponent?: RefreshControl)
{
	return function(props: PropsWithChildren<any> & PropsWithRef<any>) 
	{
		return (
			<BottomNavigator
				refreshControl={RefreshControlComponent}
			>
				<Component {...props}></Component>
			</BottomNavigator>
		)
	}
}

export function withStatusBarBottomNavigator(Component: React.FC<any>, RefreshControlComponent?: RefreshControl)
{
	return withStatusBar(withBottomNavigator(Component, RefreshControlComponent))
}