import { Icon, Text, contextMenu, useScreen } from "@common";
import { type IMediaSource } from "@media-source";
import { QueueActions, useQueue } from "@queue";
import { Show, createEffect, createSignal, on, type Component } from "solid-js";

contextMenu;

export const PreviewThumbnail: Component = () => {
	let containerRef!: HTMLDivElement;
	const queue = useQueue();
	const screen = useScreen();

	const [size, setSize] = createSignal(0);

	createEffect(
		on(
			() => [screen.width, screen.height],
			() => {
				const rect = containerRef.getBoundingClientRect();
				setSize(Math.min(rect.width, rect.height));
			}
		)
	);

	return (
		<div class="flex-row-center justify-center h-full" ref={containerRef}>
			<Show when={queue.data.nowPlaying} keyed fallback={<Skeleton size={size()} />}>
				{({ mediaSource }) => <Thumbnail size={size()} mediaSource={mediaSource} />}
			</Show>
		</div>
	);
};

type ThumbnailProps = {
	size: number;
	mediaSource: IMediaSource;
};

const Thumbnail: Component<ThumbnailProps> = (props) => {
	return (
		<div
			class="relative max-w-[32rem] max-h-[32rem]"
			style={{
				width: `${props.size}px`,
				height: `${props.size}px`,
			}}
		>
			<div class="absolute w-full h-full opacity-0 hover:opacity-100 transition flex items-end">
				<div class="w-full flex flex-col justify-end min-h-[75%] bg-gradient-to-t from-black to-black/0">
					<div class="text-center space-y-2 truncate text-shadow px-4">
						<Text.H1 truncate>{props.mediaSource.title}</Text.H1>
						<Text.Body2 truncate>{props.mediaSource.creator}</Text.Body2>
					</div>
					<QueueActions extraClass="w-full justify-evenly py-4" extraButtonClass="p-4" iconSize="lg" />
				</div>
			</div>
			<img src={props.mediaSource.maxThumbnailUrl} class="h-full object-cover" />
		</div>
	);
};

type SkeletonProps = {
	size: number;
};

const Skeleton: Component<SkeletonProps> = (props) => {
	return (
		<div
			class="max-w-[32rem] max-h-[32rem] mx-auto border border-neutral-850 flex items-center justify-center"
			style={{
				width: `${props.size}px`,
				height: `${props.size}px`,
			}}
		>
			<Icon name="musicNotes" extraClass="text-neutral-900 h-[50%] max-h-48 w-auto" />
		</div>
	);
};
