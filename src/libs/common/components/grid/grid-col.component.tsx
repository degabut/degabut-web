import { For, createMemo, type JSX } from "solid-js";
import { breakpointKeys, breakpoints, type BreakpointKeys } from "../../constants";
import { useScreen } from "../../providers";

type Props<Item> = {
	extraClass?: string;
	maxRows?: number;
	items: Item[];
	minWidth?: string | number;
	cols: number | Partial<Record<BreakpointKeys, number>>;
	children: (item: Item) => JSX.Element;
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
			.find(([bp]) => breakpoints[bp] <= screen.width);

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

	const repeatCount = () => Math.min(col()?.count ?? 1, items().length);

	return (
		<div
			class="grid auto-cols-fr"
			classList={{ [props.extraClass ?? ""]: !!props.extraClass }}
			style={{
				"grid-template-columns": `repeat(${repeatCount()}, minmax(${props.minWidth || 0}, 0fr))`,
			}}
		>
			<For each={items()}>
				{(item) => (typeof props.children === "function" ? props.children(item) : props.children)}
			</For>
		</div>
	);
}
