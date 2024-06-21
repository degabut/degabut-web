import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { Container, Icon, Input, Item, Text, useNavigate, useScreen } from "@common";
import { MediaSource, MediaSourceFactory, useMatchMediaUrlId } from "@media-source";
import { useQueue } from "@queue";
import { useSearchParams } from "@solidjs/router";
import { YouTubeContextMenuUtil, YouTubePlaylist, useSearch } from "@youtube";
import { For, Show, onMount, type Component } from "solid-js";

export const Search: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;
	const screen = useScreen();
	const navigate = useNavigate();

	const [query, setQuery] = useSearchParams<{ keyword: string }>();
	const matchUrl = useMatchMediaUrlId(query.keyword || "");
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
		matchUrl.setKeyword(value);
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
				prefix={() => <Icon name="search" size="lg" />}
			/>

			<div class="lg:space-y-2.5 space-y-2">
				<Show when={!queue.data.empty && matchUrl.ids().length}>
					<div class="space-y-1.5">
						<For each={matchUrl.ids()}>
							{(item) => (
								<Item.Hint
									label={() => (
										<Text.Body1 truncate class="text-neutral-400">
											Add {item.label} to queue
										</Text.Body1>
									)}
									icon="plus"
									onClick={() => {
										queue.addTrackById(item);
										navigate(AppRoutes.Queue);
									}}
								/>
							)}
						</For>
					</div>
				</Show>

				<Show
					when={!search.isLoading()}
					fallback={
						<For each={Array(5)}>{() => <Item.ListSkeleton size={screen.gte.md ? "lg" : "md"} />}</For>
					}
				>
					<For each={search.result()}>
						{(item) => {
							if ("duration" in item) {
								const mediaSource = MediaSourceFactory.fromYoutubeVideo(item);
								return (
									<MediaSource.List size={screen.gte.md ? "lg" : "md"} mediaSource={mediaSource} />
								);
							} else {
								return (
									<YouTubePlaylist.List
										size={screen.gte.md ? "lg" : "md"}
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
