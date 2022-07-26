type anonymousHandler = () => void

type acceptRejectType = {
	accept: (...args: any[]) => any,
	reject: (...args: any[]) => any,
}