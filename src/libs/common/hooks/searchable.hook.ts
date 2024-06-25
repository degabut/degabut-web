import { createMemo, type Accessor } from "solid-js";

type Props<T> = {
	minimumKeywordLength?: number;
	keyword: Accessor<string>;
	items: Accessor<T[]>;
	keys: (item: T) => string[];
	returnEmptyOnEmptyKeyword?: boolean;
};

export function useSearchable<T = unknown>(props: Props<T>) {
	const result = createMemo(() => {
		const items = props.items();
		const keyword = props.keyword().toLowerCase();

		if (!keyword.length || keyword.length < (props.minimumKeywordLength || 0)) return [];

		const keywords = keyword.split(" ");
		const result = items.filter((item) => {
			const keys = props.keys(item).join(" ").toLowerCase();
			return keywords.every((keywordValue) => keys.includes(keywordValue));
		});

		return result;
	});

	return result;
}
