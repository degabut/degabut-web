import { IVideoCompact } from "@api";
import { Divider } from "@components/Divider";
import { Modal } from "@components/Modal";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useVideos } from "@hooks/useVideos";
import { useNavigate } from "solid-app-router";
import { Component, createMemo } from "solid-js";

export enum ShowMoreType {
	MostPlayed = 1,
	RecentlyPlayed = 2,
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
		return props.type === ShowMoreType.MostPlayed
			? {
					userId: props.initialUserId,
					days: 30,
					count: 20,
			  }
			: props.type === ShowMoreType.RecentlyPlayed
			? {
					userId: props.initialUserId,
					last: 20,
			  }
			: null;
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
					<div class="text-xl font-medium text-center mb-4 md:mb-6">
						{props.type === ShowMoreType.MostPlayed ? "Most Played" : "Recently Played"}
					</div>
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
