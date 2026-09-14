import { Button, Text, useContextMenu, type IContextMenuItem } from "@common";
import { type Component } from "solid-js";
import { type MediaSourceSelectStore } from "../../providers";

type Props = {
	selection: MediaSourceSelectStore;
	onMenuItems: () => IContextMenuItem[];
};

export const MediaSourceSelectionBar: Component<Props> = (props) => {
	const menu = useContextMenu();

	let barElement!: HTMLButtonElement;

	const selectedCount = () => Object.keys(props.selection.ids() ?? {}).length;

	const openMenu = () => {
		if (!menu) return;
		const rect = barElement.getBoundingClientRect();
		menu.show({
			items: props.onMenuItems(),
			target: barElement,
			x: rect.left,
			y: rect.top,
			openWithClick: false,
		});
	};

	return (
		<div class="flex-row-center w-full bg-neutral-800 border-t border-neutral-800 p-1.5">
			<Button
				flat
				ref={barElement}
				class="grow w-full h-full p-1.5 space-x-1.5"
				onClick={openMenu}
				icon="check"
				iconSize="lg"
				iconClassList={{ "text-brand-500": true }}
			>
				<Text.Body1 class="font-medium underline">{selectedCount()} selected</Text.Body1>
			</Button>

			<Button
				flat
				icon="closeLine"
				iconSize="md"
				title="Clear selection"
				class="p-3"
				onClick={() => props.selection.clear()}
			/>
		</div>
	);
};
