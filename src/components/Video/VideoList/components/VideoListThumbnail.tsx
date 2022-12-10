import { IVideoCompact } from "@api";
import { Icon } from "@components/Icon";
import { Text } from "@components/Text";
import { secondsToTime } from "@utils";
import { Component, Show } from "solid-js";

type Props = {
	video: IVideoCompact;
	inQueue?: boolean;
	extraClass?: string;
	extraContainerClass?: string;
};

export const VideoListThumbnail: Component<Props> = (props) => {
	return (
		<img
			src={props.video.thumbnails[0]?.url}
			alt={props.video.title}
			class="h-12 w-12 object-cover rounded"
			classList={{ [props.extraClass || ""]: !!props.extraClass }}
		/>
	);
};

export const VideoListThumbnailBig: Component<Props> = (props) => {
	return (
		<div
			class="relative flex bg-black rounded"
			classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}
		>
			<div class="sm:w-[16rem] sm:h-[9rem] mx-auto">
				<img
					src={props.video.thumbnails.at(-1)?.url}
					alt={props.video.title}
					class="h-full w-full relative object-cover rounded"
					classList={{ [props.extraClass || ""]: !!props.extraClass }}
				/>
			</div>

			<Show when={props.video.duration > 0 || props.inQueue}>
				<div class="absolute bottom-0 right-0 flex-row-center space-x-1.5 text-sm bg-black/90 py-1 px-2 rounded-br">
					<Show when={props.video.duration > 0}>
						<Text.Body2 class="text-neutral-400">{secondsToTime(props.video.duration)}</Text.Body2>
					</Show>

					<Show when={props.inQueue}>
						<div title="In Queue">
							<Icon name="degabut" class="fill-brand-600 w-3.5 h-3.5" />
						</div>
					</Show>
				</div>
			</Show>
		</div>
	);
};
