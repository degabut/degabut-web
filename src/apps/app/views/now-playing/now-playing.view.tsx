import { useApp } from "@app/providers";
import { Container } from "@common";
import { onMount, type Component } from "solid-js";
import { NowPlayingController } from "../../components";

export const QueueNowPlaying: Component = () => {
	const app = useApp()!;

	onMount(() => app.setTitle(null));

	return (
		<Container size="full" padless centered extraClass="h-full p-4 pb-2.5">
			<NowPlayingController />
		</Container>
	);
};
