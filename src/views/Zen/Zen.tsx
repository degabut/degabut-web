import { RouterLink } from "@components/A";
import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Text } from "@components/Text";
import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useFullscreen } from "@providers/AppProvider";
import { Component, createSignal, Show } from "solid-js";
import { PlayerCard, TracksCard } from "./components";

export const Zen: Component = () => {
	const screen = useScreen();
	useFullscreen();

	const queue = useQueue();
	const [isShowTracks, setIsShowTracks] = createSignal(screen.gte.md);

	return (
		<Container size="full" padless extraClass="relative h-full bg-neutral-900 z-0 p-2 lg:p-8">
			<RouterLink href="/app/queue">
				<Button flat class="absolute top-4 left-4 py-1.5 px-3">
					<Text.H4>Exit</Text.H4>
				</Button>
			</RouterLink>

			<Show when={queue.data.nowPlaying} keyed>
				{({ video }) => (
					<>
						<img
							src={video.thumbnails.at(0)?.url}
							class="absolute bottom-[0] left-0 h-full w-full object-cover blur-2xl opacity-40 -z-10 pointer-events-none"
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
								<PlayerCard
									isShowTracks={isShowTracks()}
									onSwitchView={() => setIsShowTracks((v) => !v)}
								/>
								<TracksCard
									isShowTracks={isShowTracks()}
									onSwitchView={() => setIsShowTracks((v) => !v)}
								/>
							</div>
						</div>
					</>
				)}
			</Show>
		</Container>
	);
};
