import { ITrack } from "@api";
import { RouterLink } from "@components/A";
import { ContextMenuButton, ContextMenuItem } from "@components/ContextMenu";
import { Text } from "@components/Text";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component } from "solid-js";

type Props = {
	track: ITrack;
};

export const NowPlaying: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="flex-col-center h-[50vh] min-h-[16rem] space-y-3">
			<img
				src={props.track.video.thumbnails.at(-1)?.url || ""}
				alt={props.track.video.title}
				class="grow object-cover"
			/>

			<div class="flex-row-center w-full">
				<div class="grow flex flex-col text-center space-y-1 text-shadow truncate">
					<Text.H2 truncate>{props.track.video.title}</Text.H2>
					<Text.Body1 truncate class="text-neutral-300">
						{props.track.video.channel?.name}
					</Text.Body1>
					<Text.Caption1 truncate class="text-neutral-300">
						Requested by {props.track.requestedBy.displayName}
					</Text.Caption1>
				</div>

				<ContextMenuButton
					contextMenu={getVideoContextMenu({
						modifyContextMenuItems: (items) => {
							items[0] = [
								{
									element: () => <ContextMenuItem icon="trashBin" label="Remove from Queue" />,
									onClick: () => queue.removeTrack(props.track),
								},
							];
							return items;
						},
						video: props.track.video,
						appStore: app,
						queueStore: queue,
						navigate,
					})}
				/>
			</div>
		</div>
	);
};

export const EmptyNowPlaying: Component = () => {
	return (
		<RouterLink
			href="/app/recommendation"
			class="flex flex-row items-center w-full space-x-4 p-1.5 hover:bg-white/[2.5%] rounded"
		>
			<div class="!w-16 !h-16 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</RouterLink>
	);
};
