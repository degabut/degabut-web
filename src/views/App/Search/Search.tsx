import { Container } from "@components/Container";
import { Input } from "@components/Input";
import { getVideoContextMenu, Video } from "@components/Video";
import { YouTubePlaylist } from "@components/YoutubePlaylist";
import { getYouTubePlaylistContextMenu } from "@components/YoutubePlaylist/utils";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useSearchYouTube } from "@hooks/useSearchYouTube";
import { useNavigate, useSearchParams } from "solid-app-router";
import { Component, For, onMount, Show } from "solid-js";

const SearchResultSkeleton: Component<{ isSmall?: boolean }> = (props) => {
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

export const Search: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const screen = useScreen();
	const navigate = useNavigate();

	const [query, setQuery] = useSearchParams<{ keyword: string }>();
	const search = useSearchYouTube({
		playlistCount: 5,
		playlistStartIndex: 5,
	});

	const initialKeyword = query.keyword || "";

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
				placeholder="Never gonna give you up"
				rounded
				focusOnMount={!query.keyword}
				class="md:max-w-[32rem]"
				value={initialKeyword}
				onInput={onInput}
			/>

			<div class="lg:space-y-8 space-y-1.5">
				<Show when={!search.isLoading()} fallback={<SearchResultSkeleton isSmall={screen().lte.md} />}>
					<For each={search.result()}>
						{(item) => {
							if ("duration" in item) {
								return (
									<Video.ListResponsive
										big={screen().gte.lg}
										video={item}
										onClick={() => navigate(`/app/video/${item.id}`)}
										contextMenu={getVideoContextMenu({
											video: item,
											appStore: app,
											queueStore: queue,
											navigate,
										})}
									/>
								);
							} else {
								return (
									<YouTubePlaylist.ListResponsive
										big={screen().gte.lg}
										playlist={item}
										contextMenu={getYouTubePlaylistContextMenu({
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
