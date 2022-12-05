import { Component, createSignal, For, JSX, onMount, Show } from "solid-js";
import { Tab } from "./Tab";

type LabelProps = {
	isActive: boolean;
};

export type Item = {
	id: string;
	label: (props: LabelProps) => JSX.Element;
	element: JSX.Element;
};

type Props = {
	items: Item[];
	extraTabsClass?: string;
	extraContainerClass?: string;
	extraContentContainerClass?: string;
	onChange?: (item: Item) => void;
};

export const Tabs: Component<Props> = (props) => {
	const [activeItem, setActiveItem] = createSignal<Item>();

	onMount(() => {
		setActiveItem(props.items[0]);
	});

	const onChange = (item: Item) => {
		setActiveItem(item);
		props.onChange?.(item);
	};

	return (
		<Show when={activeItem()} keyed>
			{(activeItem) => {
				return (
					<div
						class="flex flex-col"
						classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}
					>
						<div
							class="flex-row-center w-full border-b border-neutral-600"
							classList={{ [props.extraTabsClass || ""]: !!props.extraTabsClass }}
						>
							<For each={props.items}>
								{(item) => <Tab item={item} onClick={onChange} isActive={item.id === activeItem.id} />}
							</For>
						</div>

						<div
							classList={{ [props.extraContentContainerClass || ""]: !!props.extraContentContainerClass }}
						>
							<div class="flex-1">{activeItem.element}</div>
						</div>
					</div>
				);
			}}
		</Show>
	);
};
