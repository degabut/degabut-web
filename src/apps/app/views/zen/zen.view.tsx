import { useFullscreen } from "@app/hooks";
import { Button, Container, RouterLink, Text } from "@common/components";
import { useScreen, useShortcut } from "@common/hooks";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component, Show, createSignal } from "solid-js";
import { PlayerCard, TracksCard } from "./components";

export const Zen: Component = () => {
	const screen = useScreen();
	const navigate = useNavigate();

	useFullscreen();

	const queue = useQueue();
	const [isShowTracks, setIsShowTracks] = createSignal(screen.gte.md);

	useShortcut({
		shortcuts: [{ key: "escape", handler: () => navigate("/queue") }],
	});

	return (
		<Container size="full" padless extraClass="relative h-full bg-neutral-900 z-0 p-2 lg:p-8">
			<RouterLink href="/queue">
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
