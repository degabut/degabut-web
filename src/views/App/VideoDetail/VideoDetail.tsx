import { IVideo } from "@api";
import { Container } from "@components/Container";
import { Divider } from "@components/Divider";
import { getVideoContextMenu, Video } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useVideo } from "@hooks/useVideo";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createMemo, onMount, Show } from "solid-js";

export const VideoDetail: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const params = useParams<{ id: string }>();
	const videoId = createMemo(() => params.id || "");
	const video = useVideo({ videoId });

	onMount(() => {
		app.setTitle("Related Video");
	});

	return (
		<Container extraClass="flex flex-col">
			<Show when={video.data()} fallback={<Video.ListBigSkeleton />} keyed>
				{(v) => (
					<Video.ListBig
						video={v as IVideo}
						contextMenu={getVideoContextMenu({
							video: v,
							appStore: app,
							queueStore: queue,
							navigate,
						})}
					/>
				)}
			</Show>

			<Divider extraClass="my-6" />

			<Show when={video.data()} fallback={<Videos.List data={[]} isLoading />} keyed>
				{(v) => (
					<Videos.List
						data={v.related || []}
						videoProps={(video) => ({
							video,
							contextMenu: getVideoContextMenu({
								video,
								appStore: app,
								queueStore: queue,
								navigate,
							}),
						})}
					/>
				)}
			</Show>
		</Container>
	);
};
