import { onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { DelayUtil, ObjectUtil } from "../utils";

type ValueBasicType = string | number | boolean | null | undefined;
type ValueType = ValueBasicType | ValueBasicType[] | Record<string, ValueBasicType>;

type Params<S extends Record<string, ValueType>> = {
	key: string;
	persistThrottle?: number;
	onChange?: <K extends keyof S>(key: K, after: S[K], before: S[K]) => void;
};

// TODO add array support
export function createPersistedStore<S extends Record<string, ValueType>>(value: S, params: Params<S>) {
	const persistedStore = localStorage.getItem(params.key);
	let initialValue = value;
	if (persistedStore) {
		try {
			initialValue = ObjectUtil.mergeObjects(value, JSON.parse(persistedStore));
		} catch {
			initialValue = value;
		}
	}

	const [store, setStore] = createStore<S>(initialValue);

	onMount(() => {
		persistStore(store);
		window.addEventListener("storage", onStorageChange);
	});

	onCleanup(() => {
		window.removeEventListener("storage", onStorageChange);
	});

	const onStorageChange = (e: StorageEvent) => {
		if (e.key !== params.key || !e.newValue) return;
		setStore(JSON.parse(e.newValue));
	};

	const setAndPersistStore = <K extends keyof S>(key: K, value: S[K] | ((v: S[K]) => S[K])) => {
		const before = store[key];
		if (typeof value === "function") value = value(before);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		setStore(key as any, value as any);
		persistStore(store);
		params.onChange?.(key, value, before);
	};

	const persistStore = DelayUtil.throttle(
		(s: S) => localStorage.setItem(params.key, JSON.stringify(s)),
		params.persistThrottle ?? 500
	);

	return [store, setAndPersistStore] as const;
}
