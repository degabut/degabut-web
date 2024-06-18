import { For, Show, type Accessor, type JSX, type ParentComponent } from "solid-js";
import { Item, Text } from "../";

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
	isLoading: boolean;
	skeletonCount?: number;
	children: (item: T) => JSX.Element;
	rightTitle?: Accessor<JSX.Element>;
	firstElement?: Accessor<JSX.Element>;
};

export function SectionList<Item = unknown>(props: Props<Item>) {
	return (
		<div class="space-y-6 md:space-y-4 @container">
			<Title right={props.rightTitle}>{props.label}</Title>

			<div class="grid grid-cols-1 @3xl:grid-cols-2 gap-x-6 @2xl:gap-x-12 @4xl:gap-x-24 gap-y-2">
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
