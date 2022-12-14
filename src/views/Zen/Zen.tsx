import { RouterLink } from "@components/A";
import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Text } from "@components/Text";
import { useQueue } from "@hooks/useQueue";
import { Component, createSignal, Show } from "solid-js";
import { PlayerCard, TracksCard } from "./components";

export const Zen: Component = () => {
	const queue = useQueue();
	const [isShowTracks, setIsShowTracks] = createSignal(false);

	return (
		<Show when={queue.data.nowPlaying} keyed>
			{({ video }) => (
				<Container
					size="full"
					padless
					extraClass="relative fixed-screen top-0 left-0 z-30 bg-gradient-to-t from-neutral-900 to-neutral-800 p-2 lg:p-8"
				>
					<RouterLink href="/app/queue">
						<Button flat class="absolute top-4 left-4 p-2">
							<Text.Body1 class="underline underline-offset-4">Exit</Text.Body1>
						</Button>
					</RouterLink>

					<img
						src={video.thumbnails.at(0)?.url}
						class="absolute bottom-[0] left-0 h-[50%] w-full blur-3xl opacity-50 -z-10 pointer-events-none"
					/>

					<div class="flex-col-center justify-center h-full w-full">
						<div
							class="grid w-full h-full max-h-[80vh]"
							classList={{
								"gap-2 lg:gap-6 2xl:gap-12": true,
								"max-w-[86rem]": isShowTracks(),
								"max-w-[42rem]": !isShowTracks(),
								"h-[36rem] 2xl:h-[42rem]": true,
								"grid-cols-1 md:grid-cols-2": isShowTracks(),
								"grid-cols-1": !isShowTracks(),
							}}
						>
							<PlayerCard isShowTracks={isShowTracks()} onSwitchView={() => setIsShowTracks((v) => !v)} />
							<TracksCard isShowTracks={isShowTracks()} onSwitchView={() => setIsShowTracks((v) => !v)} />
						</div>
					</div>
				</Container>
			)}
		</Show>
	);
};
