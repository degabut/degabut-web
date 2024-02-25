import { Item, Text } from "@common/components";
import { Accessor, For, JSX, ParentComponent, Show } from "solid-js";

type TitleProps = {
	right?: Accessor<JSX.Element>;
};

const Title: ParentComponent<TitleProps> = (props) => {
	return (
		<div class="flex flex-row justify-between items-end">
			<Text.H2 class="text-xl font-medium">{props.children}</Text.H2>
			{props.right?.()}
		</div>
	);
};

type Props<T> = {
	items: T[];
	label: string;
	inline?: boolean;
	isLoading: boolean;
	skeletonCount?: number;
	children: (item: T) => JSX.Element;
	rightTitle?: Accessor<JSX.Element>;
	firstElement?: Accessor<JSX.Element>;
};

export function SectionList<Item = unknown>(props: Props<Item>) {
	return (
		<div class="space-y-6 md:space-y-4">
			<Title right={props.rightTitle}>{props.label}</Title>

			<div
				class="grid grid-cols-1 gap-x-6 2xl:gap-x-12 3xl:gap-x-24 gap-y-2"
				classList={{ "xl:grid-cols-2": props.inline !== false }}
			>
				{props.firstElement?.()}
				<Show
					when={!props.isLoading}
					fallback={<For each={Array(props.skeletonCount || 10)}>{() => <Item.ListSkeleton />}</For>}
				>
					<For each={props.items}>{(item) => props.children(item as Item)}</For>
				</Show>
			</div>
		</div>
	);
}
