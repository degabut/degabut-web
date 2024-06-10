import { Button, ContextMenuButton, type Icons } from "@common";
import { useMediaSourceContextMenu, type IMediaSource } from "@media-source";
import { Show, createSignal, type Component } from "solid-js";

type ActionButtonProps = {
	title: string;
	icon: Icons;
	disabled?: boolean;
	onClick: () => Promise<void>;
};

const ActionButton: Component<ActionButtonProps> = (props) => {
	const [isLoading, setIsLoading] = createSignal(false);

	const onClickHandler = async (e: MouseEvent) => {
		e.stopPropagation();
		setIsLoading(true);
		await props.onClick?.();
		setIsLoading(false);
	};

	return (
		<Button
			rounded
			flat
			title={props.title}
			disabled={isLoading() || props.disabled}
			class="p-2.5"
			classList={{
				"bg-brand-900 !text-black": isLoading() || props.disabled,
				"bg-brand-600 hover:!bg-brand-400 text-neutral-800 hover:!text-black": !isLoading() && !props.disabled,
			}}
			icon={props.icon}
			on:click={onClickHandler}
		/>
	);
};

type Props = {
	mediaSource: IMediaSource;
	showAddButtons: boolean;
	inQueue: boolean;
	isPlaying: boolean;
	onAddToQueue: () => Promise<void>;
	onPlay: () => Promise<void>;
};

export const ThumbnailHover: Component<Props> = (props) => {
	const contextMenu = useMediaSourceContextMenu(() => ({ mediaSource: props.mediaSource }));

	return (
		<div class="hover:bg-black/50 w-full h-full">
			<div class="absolute top-0 right-0">
				<ContextMenuButton contextMenu={contextMenu()} />
			</div>

			<Show when={props.showAddButtons}>
				<div class="absolute bottom-2.5 right-2.5 flex-row-center space-x-2">
					<ActionButton
						title="Add to Queue"
						icon="plus"
						disabled={props.inQueue}
						onClick={() => props.onAddToQueue?.()}
					/>
					<ActionButton title="Play" icon="play" disabled={props.isPlaying} onClick={() => props.onPlay()} />
				</div>
			</Show>
		</div>
	);
};
