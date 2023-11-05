import { useQueue } from "@app/hooks";
import { Icon, Input, Item } from "@common/components";
import { Video, YouTubePlaylist } from "@youtube/components";
import { useSearch } from "@youtube/hooks";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, For, Show } from "solid-js";
import { Card } from "../../components";

const SearchResultSkeleton: Component<{ isSmall?: boolean; count?: number }> = (props) => {
	return (
		<For each={Array(5)}>
			{() => (
				<Show when={props.isSmall} fallback={<Item.ListBigSkeleton />}>
					<Item.ListSkeleton />
				</Show>
			)}
		</For>
	);
};

export const Search: Component = () => {
	const queue = useQueue();

	const search = useSearch({
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
				prefix={() => <Icon name="search" size="lg" extraClass="fill-current" />}
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
											contextMenu={YouTubeContextMenuUtil.getVideoContextMenu({
												video: item,
												queueStore: queue,
											})}
										/>
									) : (
										<YouTubePlaylist.List
											playlist={item}
											contextMenu={YouTubeContextMenuUtil.getPlaylistContextMenu({
												queueStore: queue,
												playlist: item,
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
