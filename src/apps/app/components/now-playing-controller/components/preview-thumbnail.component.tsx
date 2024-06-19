import { Icon, useAspectSquare } from "@common";
import type { IMediaSource } from "@media-source";
import { Show, type Component } from "solid-js";

type PreviewThumbnailProps = {
	mediaSource?: IMediaSource;
	onClick?: () => void;
};

export const PreviewThumbnail: Component<PreviewThumbnailProps> = (props) => {
	let containerRef!: HTMLDivElement;
	const size = useAspectSquare(() => containerRef);

	return (
		<div class="flex-row-center justify-center h-full" ref={containerRef}>
			<Show when={props.mediaSource} keyed fallback={<Skeleton size={size()} />}>
				{(mediaSource) => <Thumbnail size={size()} mediaSource={mediaSource} onClick={props.onClick} />}
			</Show>
		</div>
	);
};

type ThumbnailProps = {
	size: number;
	mediaSource: IMediaSource;
	onClick?: () => void;
};

const Thumbnail: Component<ThumbnailProps> = (props) => {
	return (
		<div
			class="absolute max-w-[32rem] max-h-[32rem]"
			style={{
				width: `${props.size}px`,
				height: `${props.size}px`,
			}}
		>
			<img
				src={props.mediaSource.maxThumbnailUrl}
				alt={props.mediaSource.title}
				class="h-full object-cover rounded"
				onClick={() => props.onClick?.()}
			/>
		</div>
	);
};

type SkeletonProps = {
	size: number;
};

const Skeleton: Component<SkeletonProps> = (props) => {
	return (
		<div
			class="absolute aspect-square w-full"
			style={{
				width: `${props.size}px`,
				height: `${props.size}px`,
			}}
		>
			<div class="w-full h-full flex-row-center justify-center rounded border border-neutral-800 p-4">
				<Icon class="text-neutral-850 w-full h-full max-w-24 max-h-24" name="musicNotes" />
			</div>
		</div>
	);
};
