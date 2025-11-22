import { type CachedVerifier } from "./auth";
import type { AccessToken, ICacheable } from "./types";
import { AccessTokenUtil } from "./utils";

type Cached = ICacheable & AccessToken;

export class Cache {
	public static readonly tokenCacheKey = "spotify-sdk:token";
	public static readonly verifierCacheKey = "spotify-sdk:verifier";

	private renewWindow: number = 2 * 60 * 1000; // Two minutes

	constructor(
		private createFunction: (code?: string) => Promise<Cached & object>,
		private updateFunction: (item: Cached) => Promise<ICacheable>
	) {}

	//#region cache
	private getCache(key: string): string | null {
		return localStorage.getItem(key);
	}

	private setCache(cacheKey: string, cacheItem: ICacheable): void {
		const asString = JSON.stringify(cacheItem);
		localStorage.setItem(cacheKey, asString);
	}

	private removeCache(key: string): void {
		localStorage.removeItem(key);
	}
	//#endregion

	//#region verifier
	public getVerifier(): CachedVerifier | null {
		const asString = this.getCache(Cache.verifierCacheKey);
		return asString ? JSON.parse(asString) : null;
	}

	public setVerifier(value: CachedVerifier) {
		this.setCache(Cache.verifierCacheKey, value);
	}

	public removeVerifier(): void {
		this.removeCache(Cache.verifierCacheKey);
	}
	//#endregion

	//#region token
	public async getOrCreateToken(code?: string): Promise<Cached> {
		const item = await this.getToken();
		if (item) return item;

		const newCacheItem = await this.createFunction(code);
		if (!newCacheItem) throw new Error("Could not create cache item");
		if (!AccessTokenUtil.isEmptyAccessToken(newCacheItem)) this.setCache(Cache.tokenCacheKey, newCacheItem);

		return newCacheItem;
	}

	public async getToken(): Promise<Cached | null> {
		const cacheKey = Cache.tokenCacheKey;
		let asString = this.getCache(cacheKey);
		let cachedItem: Cached = asString ? JSON.parse(asString) : null;

		if (this.itemDueToExpire(cachedItem)) {
			await this.tryUpdateItem(cacheKey, cachedItem, this.updateFunction);

			// Ensure updated item is returned
			asString = this.getCache(cacheKey);
			cachedItem = asString ? JSON.parse(asString) : null;
		}

		if (!cachedItem) return null;

		if (cachedItem.expires && (cachedItem.expires === -1 || cachedItem.expires <= Date.now())) {
			this.removeCache(cacheKey);
			return null;
		}

		if (cachedItem.expiresOnAccess && cachedItem.expiresOnAccess === true) {
			this.removeCache(cacheKey);
			return cachedItem;
		}

		return cachedItem;
	}

	public setToken(value: object, expiresIn: number): void {
		const expires = Date.now() + expiresIn;
		const cacheItem: ICacheable = { ...value, expires };
		this.setCache(Cache.tokenCacheKey, cacheItem);
	}

	public removeToken(): void {
		this.removeCache(Cache.tokenCacheKey);
	}

	private itemDueToExpire(item: ICacheable): boolean {
		if (!item?.expires) return false;
		return item.expires - Date.now() < this.renewWindow;
	}

	private async tryUpdateItem(
		key: string,
		cachedItem: Cached,
		updateFunction: (item: Cached) => Promise<ICacheable>
	) {
		try {
			const updated = await updateFunction(cachedItem);
			if (updated) {
				this.setCache(key, updated);
			}
		} catch (e) {
			console.error(e);
		}
	}
	//#endregion
}
