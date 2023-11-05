import { clickOutside } from "@common/directives";
import { Accessor, For, JSX, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Input, InputProps } from "../input";

clickOutside;

type Props<Item = unknown> = {
	inputProps: InputProps;
	options: Item[];
	extraResultContainerClass?: string;
	hideOptionOnClickOutside?: boolean;
	children: (item: Item, isSelected: boolean, index: number) => JSX.Element;
	onSelect: (item: Item, index: number, e: KeyboardEvent | MouseEvent) => void;
	hint?: Accessor<JSX.Element>;
};

export function Select<Item = unknown>(props: Props<Item>) {
	const [selectedIndex, setSelectedIndex] = createSignal(0);
	const [isShowOptionList, setIsShowOptionList] = createSignal(false);
	let optionList!: HTMLDivElement;

	onMount(() => {
		document.addEventListener("keydown", onKeyDown);
	});

	onCleanup(() => {
		document.removeEventListener("keydown", onKeyDown);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (!props.options.length) return;

		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			const newIndex = e.key === "ArrowUp" ? selectedIndex() - 1 + props.options.length : selectedIndex() + 1;
			setSelectedIndex(newIndex % props.options.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			props.onSelect(props.options[selectedIndex()], selectedIndex(), e);
		}
	};

	createEffect(() => {
		if (!props.options.length) return;
		setSelectedIndex(0);
		setIsShowOptionList(true);
	});

	createEffect(() => {
		const index = selectedIndex();
		const element = optionList?.children.item(index) as HTMLDivElement | null;
		if (!element) return;

		const { bottom, top } = element.getBoundingClientRect();
		const containerRect = optionList.getBoundingClientRect();

		const isInViewport =
			top <= containerRect.top ? containerRect.top - top <= 0 : bottom - containerRect.bottom <= 0;

		if (isInViewport) return;

		element.scrollIntoView({ block: "nearest" });
	});

	return (
		<div
			class="relative w-full space-y-4"
			use:clickOutside={() => props.hideOptionOnClickOutside && setIsShowOptionList(false)}
		>
			<Input {...props.inputProps} onFocus={() => setIsShowOptionList(true)} />

			{props.hint?.()}

			<Show when={props.options.length && isShowOptionList()}>
				<div
					ref={optionList}
					class="absolute overflow-y-scroll w-full"
					classList={{ [props.extraResultContainerClass || ""]: !!props.extraResultContainerClass }}
				>
					<For each={props.options}>
						{(item, index) => (
							<div onClick={(e) => props.onSelect(item, index(), e)}>
								{props.children(item, selectedIndex() === index(), index())}
							</div>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
