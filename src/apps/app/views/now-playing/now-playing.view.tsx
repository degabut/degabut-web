import { useApp } from "@app/hooks";
import { Container } from "@common";
import { onMount, type Component } from "solid-js";
import { NowPlayingController } from "../../components";

export const QueueNowPlaying: Component = () => {
	const app = useApp();

	onMount(() => app.setTitle("Queue"));

	return (
		<Container size="full" padless centered extraClass="h-full px-4 py-2">
			<NowPlayingController />
		</Container>
	);
};
