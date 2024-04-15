import { Skeleton } from "@common";
import type { IThumbnail } from "@youtube";
import { Show, createMemo, type Component } from "solid-js";

type Props = {
	thumbnails: IThumbnail[];
};

export const ChannelThumbnail: Component<Props> = (props) => {
	const thumbnail = createMemo(() => props.thumbnails?.at(0)?.url);

	return (
		<Show when={thumbnail()}>
			<img src={thumbnail()} class="w-8 h-8 rounded-full" alt="" />
		</Show>
	);
};

export const ChannelThumbnailSkeleton: Component = () => {
	return <Skeleton.Image rounded extraClass="w-8 h-8" />;
};
