import { RouterLink } from "@components/A";
import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Text } from "@components/Text";
import { useQueue } from "@hooks/useQueue";
import { Component, Show } from "solid-js";
import { QueueActions, SeekSlider } from "./components";
import { QueueTrackList } from "./components/QueueTabs/QueueTrackList";

export const Zen: Component = () => {
	const queue = useQueue();

	return (
		<Show when={queue.data.nowPlaying} keyed>
			{({ video }) => (
				<Container
					size="full"
					padless
					extraClass="relative fixed-screen top-0 left-0 z-30 bg-gradient-to-t from-neutral-900 to-neutral-800 p-2 lg:p-8"
				>
					<img
						src={video.thumbnails.at(0)?.url}
						class="absolute bottom-[0] left-0 h-[50%] w-full blur-[128px] opacity-50 -z-10 pointer-events-none"
					/>

					<RouterLink href="/app/queue">
						<Button flat class="absolute top-4 left-4 p-2">
							<Text.Body1 class="underline underline-offset-4">Back to Queue</Text.Body1>
						</Button>
					</RouterLink>

					<div class="flex items-center justify-center h-full w-full">
						<div class="grid lg:grid-cols-2 gap-12 w-full h-full max-w-[86rem] max-h-[48rem]">
							<div class="bg-black/50 p-4 lg:p-8 rounded-lg h-full flex-col-center justify-evenly truncate">
								<img
									src={video.thumbnails.at(-1)?.url || ""}
									class="grow h-12 max-h-96 object-cover rounded"
								/>

								<div class="flex-col-center w-full text-shadow space-y-2 text-center">
									<Text.H1 truncate class="w-full text-3xl text-shadow">
										{video.title}
									</Text.H1>
									<Text.Body2 truncate class="w-full">
										{video.channel.name}
									</Text.Body2>
								</div>

								<SeekSlider
									max={video.duration}
									onChange={(value) => queue.seek(value * 1000)}
									value={(queue.data.position || 0) / 1000}
								/>

								<QueueActions
									extraClass="justify-evenly w-full"
									extraButtonClass="p-4 md:px-8"
									iconSize="xl"
								/>
							</div>

							<div class="bg-black/50 p-8 rounded-lg h-full overflow-y-auto hidden lg:block">
								<QueueTrackList keyword="" />
							</div>
						</div>
					</div>
				</Container>
			)}
		</Show>
	);
};
