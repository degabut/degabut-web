import { IVideoCompact } from "@api";
import { ContextMenuItem } from "@components/ContextMenu";
import { Divider } from "@components/Divider";
import { Modal } from "@components/Modal";
import { Text } from "@components/Text";
import { Videos } from "@components/Videos";
import { useApi } from "@hooks/useApi";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useVideos } from "@hooks/useVideos";
import { getVideoContextMenu, removePlayHistoryConfirmation } from "@utils";
import { useNavigate } from "solid-app-router";
import { Component, createMemo } from "solid-js";

export enum ShowMoreType {
	MostPlayed = 1,
	RecentlyPlayed = 2,
	ChannelRelated = 3,
}

type Props = {
	isOpen: boolean;
	initialUserId: string;
	type: ShowMoreType | null;
	onClose: () => void;
	onAddToQueue?: (video: IVideoCompact) => void;
	onAddToQueueAndPlay?: (video: IVideoCompact) => void;
};

export const ShowMoreModal: Component<Props> = (props) => {
	const app = useApp();
	const api = useApi();
	const queue = useQueue();
	const navigate = useNavigate();

	const params = createMemo(() => {
		switch (props.type) {
			case ShowMoreType.MostPlayed:
				return {
					userId: props.initialUserId,
					days: 30,
					count: 20,
				};

			case ShowMoreType.RecentlyPlayed:
				return {
					userId: props.initialUserId,
					last: 20,
				};

			case ShowMoreType.ChannelRelated:
				return {
					userId: props.initialUserId,
					voiceChannel: true,
					days: 14,
					count: 20,
				};

			default:
				return null;
		}
	});

	const label = createMemo(() => {
		switch (props.type) {
			case ShowMoreType.MostPlayed:
				return "Most Played";

			case ShowMoreType.RecentlyPlayed:
				return "Recently Played";

			case ShowMoreType.ChannelRelated:
				return "Queue Recommendations";

			default:
				return null;
		}
	});

	const videos = useVideos(params);

	const videoProps = (video: IVideoCompact) => {
		const removable = props.type === ShowMoreType.RecentlyPlayed || props.type === ShowMoreType.MostPlayed;

		return {
			video,
			inQueue: queue.data.tracks?.some((t) => t.video.id === video.id),
			contextMenu: getVideoContextMenu({
				video,
				appStore: app,
				queueStore: queue,
				navigate,
				modifyContextMenuItems: (items) => {
					if (removable) {
						items[0].push({
							element: <ContextMenuItem label="Remove From History" icon="closeLine" />,
							onClick: () => promptRemoveVideo(video),
						});
					}
					return items;
				},
			}),
		};
	};

	const promptRemoveVideo = async (video: IVideoCompact) => {
		app.setConfirmation(
			removePlayHistoryConfirmation(video, async () => {
				await api.me.removePlayHistory(video.id);
				await videos.refetch();
			})
		);
	};

	return (
		<Modal
			extraContainerClass="bg-neutral-900 w-[42rem] top-[15vh] h-[90vh] md:h-[70vh]"
			isOpen={props.isOpen}
			closeOnEscape
			onClickOutside={() => props.onClose()}
		>
			<div class="flex flex-col h-full">
				<div class="py-4 !pb-0 z-10">
					<Text.H2 class="text-center mb-4">{label()}</Text.H2>
					<Divider />
				</div>
				<div class="pb-8 pt-4 px-2 md:px-8 overflow-auto">
					<Videos.List data={videos.data() || []} isLoading={videos.data.loading} videoProps={videoProps} />
				</div>
			</div>
		</Modal>
	);
};
