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
				<div class="z-0">
					<img
						src={mediaSource.maxThumbnailUrl}
						alt={mediaSource.title}
						class="object-cover max-w-[50vh] w-full aspect-square rounded-2xl"
						onClick={() => props.onClick()}
					/>
					<img
						src={mediaSource.minThumbnailUrl}
						class="absolute top-0 left-0 max-h-[50vh] aspect-square blur-3xl w-full -z-[1000] pointer-events-none"
					/>
				</div>
			)}
		</Show>
	);
};

const Skeleton: Component = () => {
	return (
		<div class="max-w-[50vh] w-full aspect-square rounded-2xl border border-neutral-800 flex-row-center justify-center">
			<Icon class="fill-neutral-850" name="musicNotes" />
		</div>
	);
};
