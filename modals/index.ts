import GlobalAlertView from "./GlobalAlertView"
import GlobalBottomSheet from "./GlobalBottomSheet"
import GlobalLoading from "./GlobalLoading"

export { default as GlobalBottomSheet } from "./GlobalBottomSheet"
export { default as GlobalAlertView } from "./GlobalAlertView"
export { default as GlobalLoading } from "./GlobalLoading"

export const gbs = new GlobalBottomSheet()
export const gav = new GlobalAlertView()
export const globalLoading = new GlobalLoading()
