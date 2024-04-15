import { createMemo, type Accessor } from "solid-js";

type Props<T> = {
	keyword: Accessor<string>;
	items: Accessor<T[]>;
	keys: (item: T) => string[];
	returnEmptyOnEmptyKeyword?: boolean;
};

export function useSearchable<T = unknown>(props: Props<T>) {
	const result = createMemo(() => {
		const items = props.items();
		const keyword = props.keyword().toLowerCase();

		if (!keyword.length) {
			return props.returnEmptyOnEmptyKeyword ? [] : items;
		}

		const keywords = keyword.split(" ");
		const result = items.filter((item) => {
			const keys = props.keys(item).join(" ").toLowerCase();
			return keywords.every((keywordValue) => keys.includes(keywordValue));
		});

		return result;
	});

	return result;
}
