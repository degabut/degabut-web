import { useApp, useQueue } from "@app/hooks";
import { Divider, Modal, Text } from "@common/components";
import { useApi } from "@common/hooks";
import { useNavigate } from "@solidjs/router";
import { UserApi } from "@user/apis";
import { usePlayHistory } from "@user/hooks";
import { UserConfirmationUtil } from "@user/utils/confirmation.util";
import { IVideoCompact } from "@youtube/apis";
import { Videos } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
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
	const userApi = new UserApi(api.client);
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
			default:
				return {
					userId: props.initialUserId,
					voiceChannel: true,
					days: 14,
					count: 20,
				};
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

	const videos = usePlayHistory(params);

	const videoProps = (video: IVideoCompact) => {
		const removable = props.type === ShowMoreType.RecentlyPlayed || props.type === ShowMoreType.MostPlayed;

		return {
			video,
			inQueue: queue.data.tracks?.some((t) => t.video.id === video.id),
			contextMenu: YouTubeContextMenuUtil.getVideoContextMenu({
				video,
				appStore: app,
				queueStore: queue,
				navigate,
				modify: (items) => {
					if (removable) {
						items[1].push({
							label: "Remove From History",
							icon: "closeLine",
							onClick: () => {
								app.setConfirmation({
									...UserConfirmationUtil.removePlayHistoryConfirmation(video),
									onConfirm: () => userApi.removePlayHistory(video.id).then(videos.refetch),
								});
							},
						});
					}
					return items;
				},
			}),
		};
	};

	return (
		<Modal
			extraContainerClass="w-[42rem] top-[15vh] h-[90vh] md:h-[70vh]"
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
