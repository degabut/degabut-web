import { Container } from "@components/Container";
import { Divider } from "@components/Divider";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useVideo } from "@hooks/useVideo";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createEffect, createMemo, onMount, Show } from "solid-js";
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

			<Divider extraClass="my-8" />

			<Show when={video.data()} fallback={<Videos.List data={[]} isLoading />} keyed>
				{(v) => (
					<Videos.List
						label={<div class="font-medium">Similar Videos</div>}
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
