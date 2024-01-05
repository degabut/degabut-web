import { useApp } from "@app/hooks";
import { Container, Icon, Input, Item } from "@common/components";
import { useScreen } from "@common/hooks";
import { MediaSource } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { YouTubePlaylist } from "@youtube/components";
import { useSearch } from "@youtube/hooks";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, For, Show, onMount } from "solid-js";

const SearchResultSkeleton: Component<{ isSmall?: boolean }> = (props) => {
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
	const app = useApp();
	const queue = useQueue();
	const screen = useScreen();
	const navigate = useNavigate();

	const [query, setQuery] = useSearchParams<{ keyword: string }>();
	const search = useSearch({
		playlistCount: 5,
		playlistStartIndex: 5,
	});

	onMount(() => {
		app.setTitle("Search");
		search.setKeyword(query.keyword || "");
	});

	const onInput = (ev: InputEvent) => {
		const value = (ev.target as HTMLInputElement).value;
		search.setKeyword(value);
		setQuery({ keyword: value });
	};

	return (
		<Container extraClass="flex flex-col space-y-4 md:space-y-6">
			<Input
				type="text"
				placeholder="Search for a song"
				rounded
				focusOnMount={!query.keyword}
				class="md:max-w-[32rem]"
				value={query.keyword || ""}
				onInput={onInput}
				prefix={() => <Icon name="search" size="lg" extraClass="fill-current" />}
			/>

			<div class="lg:space-y-8 space-y-1.5">
				<Show when={!search.isLoading()} fallback={<SearchResultSkeleton isSmall={!screen.gte.md} />}>
					<For each={search.result()}>
						{(item) => {
							if ("duration" in item) {
								const mediaSource = MediaSourceFactory.fromYoutubeVideo(item);
								return (
									<MediaSource.ListResponsive
										big={screen.gte.lg}
										mediaSource={mediaSource}
										inQueue={queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id)}
										contextMenu={MediaSourceContextMenuUtil.getContextMenu({
											mediaSource,
											appStore: app,
											queueStore: queue,
											navigate,
										})}
									/>
								);
							} else {
								return (
									<YouTubePlaylist.ListResponsive
										big={screen.gte.lg}
										playlist={item}
										contextMenu={YouTubeContextMenuUtil.getPlaylistContextMenu({
											appStore: app,
											queueStore: queue,
											playlist: item,
										})}
									/>
								);
							}
						}}
					</For>
				</Show>
			</div>
		</Container>
	);
};
