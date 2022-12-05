import { Accessor, createMemo } from "solid-js";

type Props<T> = {
	keyword: Accessor<string>;
	items: Accessor<T[]>;
	keys: (item: T) => string[];
};

export function useSearchable<T = unknown>(props: Props<T>) {
	const result = createMemo(() => {
		const items = props.items();
		const keywords = props.keyword().toLowerCase().split(" ");

		return items.filter((item) => {
			const keys = props.keys(item).join(" ").toLowerCase();
			return keywords.every((keywordValue) => keys.includes(keywordValue));
		});
	});

	return result;
}
