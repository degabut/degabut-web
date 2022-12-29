import { Icons } from "@components/Icon";
import { Component, createSignal, For, JSX, onMount, Show } from "solid-js";
import { Tab } from "./Tab";

type LabelProps = {
	isActive: boolean;
};

export type Item = {
	id: string;
	element: JSX.Element;
} & (
	| {
			label: (props: LabelProps) => JSX.Element;
	  }
	| {
			labelText: string;
			icon: Icons;
	  }
);

type Props = {
	items: Item[];
	end?: JSX.Element | ((item: Item) => JSX.Element);
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
						<div class="flex flex-col overflow-x-auto overflow-y-hidden md:flex-row border-b items-center border-neutral-600">
							<div
								class="flex-row-center shrink-0 h-full w-full md:w-max border-b md:border-b-0 border-neutral-600"
								classList={{ [props.extraTabsClass || ""]: !!props.extraTabsClass }}
							>
								<For each={props.items}>
									{(item) => (
										<Tab item={item} onClick={onChange} isActive={item.id === activeItem.id} />
									)}
								</For>
							</div>

							<Show when={props.end}>
								<div class="flex w-full md:justify-end pt-4 md:py-0">
									{typeof props.end === "function" ? props.end(activeItem) : props.end}
								</div>
							</Show>
						</div>

						<div
							classList={{ [props.extraContentContainerClass || ""]: !!props.extraContentContainerClass }}
						>
							{activeItem.element}
						</div>
					</div>
				);
			}}
		</Show>
	);
};
