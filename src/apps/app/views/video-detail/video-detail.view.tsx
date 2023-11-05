import { useApp, useQueue } from "@app/hooks";
import { Container, Divider, Text } from "@common/components";
import { useNavigate, useParams } from "@solidjs/router";
import { Videos } from "@youtube/components";
import { useVideo } from "@youtube/hooks";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show, createEffect, createMemo, onMount } from "solid-js";
import { MainVideo, MainVideoSkeleton } from "./components";

export const VideoDetail: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const params = useParams<{ id: string }>();
	const videoId = createMemo(() => params.id || "");
	const video = useVideo({ videoId });

	onMount(() => {
		app.setTitle("");
	});

	createEffect(() => {
		if (videoId()) video.mutate(null);
	});

	return (
		<Container size="md">
			<Show when={video.data()} fallback={<MainVideoSkeleton />} keyed>
				{(v) => <MainVideo video={v} />}
			</Show>

			<Divider extraClass="my-6" />

			<Show when={video.data()} fallback={<Videos.List data={[]} isLoading />} keyed>
				{(v) => (
					<Videos.List
						title={() => <Text.H4>Similar Videos</Text.H4>}
						data={v.related || []}
						videoProps={(video) => ({
							video,
							inQueue: queue.data.tracks.some((t) => t.video.id === video.id),
							contextMenu: YouTubeContextMenuUtil.getVideoContextMenu({
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
