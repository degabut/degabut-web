import { createMemo, type Accessor } from "solid-js";

type Props<T> = {
	items: T[] | Accessor<T[]>;
	key: (item: T) => string;
};

export function useUnique<T = unknown>(props: Props<T>) {
	const result = createMemo(() => {
		const items = typeof props.items === "function" ? props.items() : props.items;
		const uniqueItems = new Map<string, T>();

		for (const item of items) {
			const key = props.key(item);
			if (!uniqueItems.has(key)) {
				uniqueItems.set(key, item);
			}
		}

		return Array.from(uniqueItems.values());
	});

	return result;
}
