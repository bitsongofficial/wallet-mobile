import GlobalAlertView from "./GlobalAlertView"
import GlobalBottomSheet from "./GlobalBottomSheet"
import GlobalLoading from "./GlobalLoading"

export { default as GlobalBottomSheet } from "./GlobalBottomSheet"
export { default as GlobalAlertView } from "./GlobalAlertView"
export { default as GlobalLoading } from "./GlobalLoading"

export const gbs = new GlobalBottomSheet()

/**
 * @example
 * const showError = async () => {
 *    gav.setMessage("Error") || gav.setMessage(["Error 1", "Error 2"])
 *    await wait(2000)
 *    gav.close()
 * }
 */
export const gav = new GlobalAlertView()
export const globalLoading = new GlobalLoading()
