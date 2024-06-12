import { Icon } from "@common";
import type { IMediaSource } from "@media-source";
import { Show, type Component } from "solid-js";

type PreviewThumbnailProps = {
	mediaSource?: IMediaSource;
	onClick: () => void;
};

export const PreviewThumbnail: Component<PreviewThumbnailProps> = (props) => {
	return (
		<Show when={props.mediaSource} keyed fallback={<Skeleton />}>
			{(mediaSource) => (
				<>
					<img
						src={mediaSource.minThumbnailUrl}
						class="absolute h-full aspect-square opacity-50 blur-[96px] pointer-events-none"
					/>
					<img
						src={mediaSource.maxThumbnailUrl}
						alt={mediaSource.title}
						class="object-cover max-w-[50vh] w-full z-0 aspect-square rounded"
						onClick={() => props.onClick()}
					/>
				</>
			)}
		</Show>
	);
};

const Skeleton: Component = () => {
	return (
		<div class="max-w-[50vh] w-full aspect-square rounded border border-neutral-800 flex-row-center justify-center">
			<Icon class="text-neutral-850 w-24 h-24" name="musicNotes" />
		</div>
	);
};
