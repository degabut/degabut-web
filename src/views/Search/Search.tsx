import { Container } from "@components/Container";
import { Icon } from "@components/Icon";
import { Input } from "@components/Input";
import { Video } from "@components/Video";
import { YouTubePlaylist } from "@components/YoutubePlaylist";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useSearchYouTube } from "@hooks/useSearchYouTube";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { getVideoContextMenu, getYouTubePlaylistContextMenu } from "@utils";
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
				prefix={<Icon name="search" size="lg" extraClass="fill-current" />}
			/>

			<div class="lg:space-y-8 space-y-1.5">
				<Show when={!search.isLoading()} fallback={<SearchResultSkeleton isSmall={screen.lte.md} />}>
					<For each={search.result()}>
						{(item) =>
							"duration" in item ? (
								<Video.ListResponsive
									big={screen.gte.lg}
									video={item}
									inQueue={queue.data.tracks?.some((t) => t.video.id === item.id)}
									onClick={() => navigate(`/app/video/${item.id}`)}
									contextMenu={getVideoContextMenu({
										video: item,
										appStore: app,
										queueStore: queue,
										navigate,
									})}
								/>
							) : (
								<YouTubePlaylist.ListResponsive
									big={screen.gte.lg}
									playlist={item}
									contextMenu={getYouTubePlaylistContextMenu({
										appStore: app,
										queueStore: queue,
										playlist: item,
									})}
								/>
							)
						}
					</For>
				</Show>
			</div>
		</Container>
	);
};
