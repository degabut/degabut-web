import { breakpointKeys, BreakpointKeys, breakpoints } from "@constants";
import { useScreen } from "@hooks/useScreen";
import { createMemo, For, JSX } from "solid-js";

type Props<Item> = {
	extraClass?: string;
	maxRows?: number;
	items: Item[];
	minWidth?: string | number;
	cols: number | Partial<Record<BreakpointKeys, number>>;
	children: ((item: Item) => JSX.Element) | JSX.Element;
};

export function GridCol<Item = unknown>(props: Props<Item>) {
	const screen = useScreen();

	const col = createMemo(() => {
		if (typeof props.cols === "number") {
			return {
				breakpoint: "xs",
				count: props.cols,
			};
		}

		const colsEntries = Object.entries(props.cols) as [BreakpointKeys, number][];
		const col = colsEntries
			.sort(([a], [b]) => breakpointKeys.indexOf(a) - breakpointKeys.indexOf(b))
			.find(([bp]) => breakpoints[bp] <= screen.size);

		return col
			? {
					breakpoint: col[0],
					count: col[1],
			  }
			: null;
	});

	const items = () => {
		const c = col();
		if (!c) return props.items;
		return props.items.slice(0, c.count * (props.maxRows ?? Infinity));
	};

	return (
		<div
			class="grid auto-cols-fr"
			classList={{ [props.extraClass ?? ""]: !!props.extraClass }}
			style={{
				"grid-template-columns": `repeat(${col()?.count ?? 1}, minmax(${props.minWidth || 0}, 1fr))`,
			}}
		>
			<For each={items()}>
				{(item) => (typeof props.children === "function" ? props.children(item) : props.children)}
			</For>
		</div>
	);
}
