import { IVideoCompact } from "@api";
import { Divider } from "@components/Divider";
import { Modal } from "@components/Modal";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useVideos } from "@hooks/useVideos";
import { getVideoContextMenu } from "@utils";
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
				return `${queue.data.voiceChannel?.name || "Channel"} Recommendations`;

			default:
				return null;
		}
	});

	const videos = useVideos(params);

	return (
		<Modal
			extraContainerClass="bg-neutral-900 w-[42rem] top-[15vh] h-[90vh] md:h-[70vh]"
			isOpen={props.isOpen}
			closeOnEscape
			onClickOutside={() => props.onClose()}
		>
			<div class="flex flex-col h-full">
				<div class="py-4 md:py-8 !pb-0 z-10">
					<div class="text-xl font-medium text-center mb-4 md:mb-6">{label()}</div>
					<Divider />
				</div>
				<div class="pb-8 pt-4 md:pt-6 px-2 md:px-8 overflow-auto">
					<Videos.List
						data={videos.data() || []}
						isLoading={videos.data.loading}
						videoProps={(video) => ({
							video: video,
							contextMenu: getVideoContextMenu({
								video,
								appStore: app,
								queueStore: queue,
								navigate,
							}),
						})}
					/>
				</div>
			</div>
		</Modal>
	);
};
