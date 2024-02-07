import { Item } from "@common/components";
import { For, JSX, Show } from "solid-js";
import { ShowMoreTitle, Title } from "./title.component";

type Props<T> = {
	items: T[];
	label: string;
	inline?: boolean;
	isLoading: boolean;
	onClickMore?: () => void;
	children: (item: T) => JSX.Element;
};

export function SectionList<Item = unknown>(props: Props<Item>) {
	return (
		<div class="space-y-6 md:space-y-4">
			<Show when={props.onClickMore} fallback={<Title>{props.label}</Title>}>
				{(c) => <ShowMoreTitle {...props} onClickMore={c} />}
			</Show>

			<div
				class="grid grid-cols-1 gap-x-6 2xl:gap-x-12 3xl:gap-x-24 gap-y-2"
				classList={{ "xl:grid-cols-2": props.inline !== false }}
			>
				<Show when={!props.isLoading} fallback={<For each={Array(10)}>{() => <Item.ListSkeleton />}</For>}>
					<For each={props.items}>{(item) => props.children(item as Item)}</For>
				</Show>
			</div>
		</div>
	);
}
