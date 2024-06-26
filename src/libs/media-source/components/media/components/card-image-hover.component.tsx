import { Button, ContextMenuButton, type Icons } from "@common";
import { useLikeMediaSource, useMediaSourceContextMenu, type IMediaSource } from "@media-source";
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
			fill
			theme="brand"
			title={props.title}
			disabled={isLoading() || props.disabled}
			class="p-3"
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

export const CardImageHover: Component<Props> = (props) => {
	const contextMenu = useMediaSourceContextMenu(() => ({ mediaSource: props.mediaSource }));
	const liked = useLikeMediaSource(() => props.mediaSource.id);

	return (
		<div class="hover:bg-black/50 w-full h-full">
			<div class="absolute top-0 w-full p-1 flex justify-between">
				<Button
					flat
					icon={liked?.isLiked() ? "heart" : "heartLine"}
					theme={liked?.isLiked() ? "brand" : "default"}
					on:click={(e) => {
						e.stopImmediatePropagation();
						liked?.toggle();
						e.currentTarget.blur();
					}}
					class="p-2"
					classList={{ visible: liked?.isLiked() }}
					iconSize="lg"
				/>
				<ContextMenuButton contextMenu={contextMenu()} />
			</div>

			<Show when={props.showAddButtons}>
				<div class="absolute bottom-2.5 right-2.5 flex-row-center space-x-2">
					<ActionButton
						title="Add to Queue"
						icon="plus"
						disabled={props.inQueue}
						onClick={() => props.onAddToQueue()}
					/>
					<ActionButton title="Play" icon="play" disabled={props.isPlaying} onClick={() => props.onPlay()} />
				</div>
			</Show>
		</div>
	);
};
