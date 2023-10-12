import { Divider, Text } from "@components/atoms";
import { Videos } from "@components/organisms";
import { Container } from "@components/templates";
import { useQueue } from "@hooks/useQueue";
import { useVideo } from "@hooks/useVideo";
import { useApp } from "@providers/AppProvider";
import { useNavigate, useParams } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
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
						title={<Text.H4>Similar Videos</Text.H4>}
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
