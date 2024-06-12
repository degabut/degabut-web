import { createSignal, For, onMount, Show, type Accessor, type Component, type JSX } from "solid-js";
import type { Icons } from "../icon";
import { Tab } from "./components";

type LabelProps = {
	isActive: boolean;
};

export type ITabItem = {
	id: string;
	element?: Accessor<JSX.Element>;
	disabled?: Accessor<boolean>;
} & (
	| {
			label: (props: LabelProps) => JSX.Element;
	  }
	| {
			labelText: string;
			icon?: Icons;
	  }
);

type Props = {
	items: ITabItem[];
	borderless?: boolean;
	extraTabsClass?: string;
	extraTabClass?: string;
	extraContainerClass?: string;
	extraContentContainerClass?: string;
	onChange?: (item: ITabItem) => void;
};

export const Tabs: Component<Props> = (props) => {
	const [activeItem, setActiveItem] = createSignal<ITabItem>();

	onMount(() => {
		setActiveItem(props.items[0]);
	});

	const onChange = (item: ITabItem) => {
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
							class="flex overflow-x-auto overflow-y-hidden  items-center"
							classList={{ "border-b border-neutral-600": !props.borderless }}
						>
							<div
								class="flex-row-center shrink-0 w-full"
								classList={{ [props.extraTabsClass || ""]: !!props.extraTabsClass }}
							>
								<For each={props.items}>
									{(item) => (
										<Tab
											item={item}
											onClick={onChange}
											disabled={item.disabled?.()}
											isActive={item.id === activeItem.id}
											extraContainerClass={props.extraTabClass}
										/>
									)}
								</For>
							</div>
						</div>

						<div
							classList={{ [props.extraContentContainerClass || ""]: !!props.extraContentContainerClass }}
						>
							{activeItem.element?.()}
						</div>
					</div>
				);
			}}
		</Show>
	);
};
