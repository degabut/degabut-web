import { RouterLink } from "@components/A";
import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Text } from "@components/Text";
import { useQueue } from "@hooks/useQueue";
import { Component, createSignal, Show } from "solid-js";
import { QueueCard } from "./components";
import { PlayerCard } from "./components/PlayerCard";

export const Zen: Component = () => {
	const queue = useQueue();
	const [isShowPlayer, setIsShowPlayer] = createSignal(true);

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
						class="absolute bottom-[0] left-0 h-[50%] w-full blur-3xl opacity-50 -z-10 pointer-events-none"
					/>

					<RouterLink href="/app/queue">
						<Button flat class="absolute top-4 left-4 p-2">
							<Text.Body1 class="underline underline-offset-4">Exit</Text.Body1>
						</Button>
					</RouterLink>

					<div class="flex-col-center justify-center h-full w-full">
						<div class="grid 2xl:grid-cols-2 gap-12 w-full h-full max-w-[36rem] 2xl:max-w-[86rem] max-h-[36rem] 2xl:max-h-[42rem]">
							<PlayerCard isShowPlayer={isShowPlayer()} onSwitchView={() => setIsShowPlayer((v) => !v)} />
							<QueueCard isShowPlayer={isShowPlayer()} onSwitchView={() => setIsShowPlayer((v) => !v)} />
						</div>
					</div>
				</Container>
			)}
		</Show>
	);
};
