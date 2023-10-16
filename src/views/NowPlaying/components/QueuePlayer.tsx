import { ITrack } from "@api";
import { RouterLink, Text } from "@components/atoms";
import { ContextMenuButton, ContextMenuItem } from "@components/molecules";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component, Show } from "solid-js";

type Props = {
	track: ITrack;
};

export const QueuePlayer: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="flex-row-center">
			<div class="grow flex flex-col space-y-1.5 px-2 text-shadow truncate">
				<Text.H2 truncate>{props.track.video.title}</Text.H2>
				<Text.Body1 truncate class="text-neutral-300">
					{props.track.video.channel?.name}
				</Text.Body1>
				<div class="flex-row-center space-x-2 truncate">
					<Show when={props.track.requestedBy.avatar} keyed>
						{(avatar) => <img src={avatar} class="h-6 w-6 rounded-full" />}
					</Show>
					<Text.Caption1>{props.track.requestedBy.displayName}</Text.Caption1>
				</div>
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
	);
};

export const QueueEmptyPlayer: Component = () => {
	return (
		<RouterLink
			href="/app/recommendation"
			class="flex flex-row items-center w-full space-x-4 px-1.5 py-2 hover:bg-white/[2.5%] rounded"
		>
			<div class="!w-16 !h-16 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</RouterLink>
	);
};
