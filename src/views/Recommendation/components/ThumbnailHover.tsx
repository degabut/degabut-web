import { Button } from "@components/Button";
import { ContextMenuButton } from "@components/ContextMenu";
import { Divider } from "@components/Divider";
import { Icons } from "@components/Icon";
import { Text } from "@components/Text";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, createSignal, Show } from "solid-js";

type ActionButtonProps = {
	label: string;
	icon: Icons;
	disabled?: boolean;
	onClick: () => Promise<void>;
};

const ActionButton: Component<ActionButtonProps> = (props) => {
	const [isLoading, setIsLoading] = createSignal(false);

	return (
		<Button
			flat
			disabled={isLoading() || props.disabled}
			class="flex-col-center justify-center space-y-2 h-full w-full"
			icon={props.icon}
			onClick={async (e) => {
				e.stopPropagation();
				setIsLoading(true);
				await props.onClick?.();
				setIsLoading(false);
			}}
		>
			<Text.Caption1 class="text-inherit">{props.label}</Text.Caption1>
		</Button>
	);
};

type Props = {
	contextMenu: ContextMenuDirectiveParams;
	showAddButtons: boolean;
	inQueue: boolean;
	isPlaying: boolean;
	onAddToQueue: () => Promise<void>;
	onPlay: () => Promise<void>;
};

export const ThumbnailHover: Component<Props> = (props) => {
	return (
		<div class="hidden md:block">
			<div class="absolute flex-row-center hover:bg-black/80 opacity-0 hover:opacity-100 transition w-full h-full">
				<div class="absolute top-0 right-0">
					<ContextMenuButton contextMenu={props.contextMenu} />
				</div>

				<Show when={props.showAddButtons}>
					<ActionButton
						label="Queue"
						icon="plus"
						disabled={props.inQueue}
						onClick={() => props.onAddToQueue?.()}
					/>
					<Divider vertical dark />
					<ActionButton label="Play" icon="play" disabled={props.isPlaying} onClick={() => props.onPlay()} />
				</Show>
			</div>
		</div>
	);
};
