import { AsyncStorageTypes, IAsyncStorage } from "core/types/connection/WalletConnect";
export class WalletConnectAsyncStorage {
	constructor()
	{
	}
	store: Map<string, any> = new Map();
	size(): number {
		return this.store.size
	}
	getStore(): Map<string, any> {
		return this.store
	}
	async getItem(k: string, cb?: AsyncStorageTypes.ErrBack<any>): Promise<any> {
		return this.getStore().get(k)
	}
	async setItem(k: string, v: any, cb?: AsyncStorageTypes.ErrBack<any>): Promise<void> {
		this.getStore().set(k, v)
	}
	async removeItem(k: string, cb?: AsyncStorageTypes.ErrBack<any>): Promise<void> {
		this.getStore().delete(k)
	}
	async clear(cb?: AsyncStorageTypes.ErrBack<any>): Promise<void> {
		this.getStore().clear()
	}
	async getAllKeys(cb?: AsyncStorageTypes.ErrBack<string[]>): Promise<string[]> {
		return Array.from(this.getStore().keys())
	}
	async multiGet(keys: string[], cb?: AsyncStorageTypes.ErrBack<AsyncStorageTypes.Entries<string, any>>): Promise<AsyncStorageTypes.Entries<string, any>> {
		return await Promise.all(keys.map(async k =>
			{
				return [k, await this.getStore().get(k)]
			}))
	}
	async multiSet(entries: AsyncStorageTypes.Entries<string, any>, cb?: AsyncStorageTypes.ErrBack<any>): Promise<void> {
		entries.forEach(e =>
			{
				this.getStore().set(e[0], e[1])
			})
	}
	async multiRemove(keys: string[], cb?: AsyncStorageTypes.ErrBack<any>): Promise<void> {
		keys.forEach(k =>
			{
				this.getStore().delete(k)
			})
	}
	async mergeItem(key: string, value: string, cb?: AsyncStorageTypes.ErrBack<string>): Promise<void> {
		const currentValue = await this.getItem(key)
		if(typeof currentValue == "string")
		{
			this.setItem(key, currentValue + value)
		}
	}
	async multiMerge(entries: AsyncStorageTypes.Entries<string, string>, cb?: AsyncStorageTypes.ArrErrBack<string>): Promise<void> {
		await Promise.all(entries.map(async e =>
			{
				if(e[1]) await this.mergeItem(e[0], e[1])
			}))
	}
	flushGetRequests() {
	}
}