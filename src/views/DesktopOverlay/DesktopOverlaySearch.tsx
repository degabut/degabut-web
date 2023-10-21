import { Icon, Input } from "@components/atoms";
import { Video, YouTubePlaylist } from "@components/molecules";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useSearchYouTube } from "@hooks/useSearchYouTube";
import { getVideoContextMenu, getYouTubePlaylistContextMenu } from "@utils/contextMenu";
import { Component, For, Show } from "solid-js";
import { Card } from "./components";

const SearchResultSkeleton: Component<{ isSmall?: boolean; count?: number }> = (props) => {
	return (
		<For each={Array(5)}>
			{() => (
				<Show when={props.isSmall} fallback={<Video.ListBigSkeleton />}>
					<Video.ListSkeleton />
				</Show>
			)}
		</For>
	);
};

export const DesktopOverlaySearch: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const search = useSearchYouTube({
		playlistCount: 5,
		playlistStartIndex: 5,
	});

	const onInput = (ev: InputEvent) => {
		const value = (ev.target as HTMLInputElement).value;
		search.setKeyword(value);
	};

	return (
		<div class="h-full flex flex-col space-y-2">
			<Input
				type="text"
				placeholder="Search for a song"
				focusOnMount
				class="!bg-black/90 rounded-lg py-1 !text-neutral-200"
				onInput={onInput}
				prefix={<Icon name="search" size="lg" extraClass="fill-current" />}
			/>

			<Show when={search.isLoading() || search.result().length}>
				<Card extraClass="w-full h-full">
					<div class="w-full h-full overflow-y-auto space-y-1.5">
						<Show when={!search.isLoading()} fallback={<SearchResultSkeleton isSmall={true} />}>
							<For each={search.result()}>
								{(item) =>
									"duration" in item ? (
										<Video.List
											video={item}
											inQueue={queue.data.tracks?.some((t) => t.video.id === item.id)}
											contextMenu={getVideoContextMenu({
												video: item,
												appStore: app,
												queueStore: queue,
												min: true,
											})}
										/>
									) : (
										<YouTubePlaylist.List
											playlist={item}
											contextMenu={getYouTubePlaylistContextMenu({
												appStore: app,
												queueStore: queue,
												playlist: item,
												min: true,
											})}
										/>
									)
								}
							</For>
						</Show>
					</div>
				</Card>
			</Show>
		</div>
	);
};
