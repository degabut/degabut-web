import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { A, Button, Container, Divider, Icon, Item, Spinner, Text, useNavigate } from "@common";
import { IS_DISCORD_EMBEDDED } from "@constants";
import { useQueue } from "@queue";
import { useSettings } from "@settings";
import { YouTubeConnectionState, YouTubeContextMenuUtil, YouTubePlaylist, useYouTubeConnect } from "@youtube";
import { For, Match, Show, Switch, createEffect, onMount, type Component } from "solid-js";
import { RefreshButton } from "./components";

export const YouTube: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;
	const youtube = useYouTubeConnect();
	const navigate = useNavigate();
	const { settings } = useSettings();

	onMount(() => app.setTitle("YouTube"));

	createEffect(() => {
		if (youtube.state() === YouTubeConnectionState.Empty) {
			youtube.initialize();
		} else if (youtube.state() === YouTubeConnectionState.Connected) {
			youtube.loadPlaylists();
		}
	});

	const refresh = () => {
		youtube.playlists.refetch();
	};

	return (
		<>
			<Switch
				fallback={
					<Container size="md" extraClass="space-y-6">
						<div class="flex flex-row justify-between items-end">
							<Text.H2 class="text-xl font-medium">Your YouTube Playlists</Text.H2>
							<RefreshButton disabled={youtube.playlists.data.loading} onClick={refresh} />
						</div>

						<Divider />

						<div class="space-y-2">
							<Show
								when={!youtube.playlists.data.loading}
								fallback={<For each={Array(5)}>{() => <Item.ListSkeleton />}</For>}
							>
								<For each={youtube.playlists.data()?.playlists || []}>
									{(item) => (
										<YouTubePlaylist.List
											onClick={() =>
												navigate(AppRoutes.YoutubePlaylist, { params: { id: item.id } })
											}
											contextMenu={YouTubeContextMenuUtil.getPlaylistContextMenu({
												playlist: item,
												queueStore: queue,
												appStore: app,
											})}
											playlist={item}
										/>
									)}
								</For>
							</Show>
						</div>
					</Container>
				}
			>
				<Match when={youtube.state() === YouTubeConnectionState.Authenticating}>
					<Container size="full" extraClass="flex-col-center justify-center h-full">
						<Spinner size="3xl" />
					</Container>
				</Match>
				<Match when={youtube.state() === YouTubeConnectionState.Disconnected}>
					<Container size="full" extraClass="flex-col-center justify-center h-full space-y-12">
						<Icon name="youtube" class="text-neutral-700 w-32 h-32" />

						<div class="flex-col-center space-y-4 text-center">
							<Show
								when={!settings["youtube.clientId"]}
								fallback={
									<Button
										rounded
										class="px-8 py-2.5"
										onClick={() => youtube.authenticate(IS_DISCORD_EMBEDDED)}
									>
										<Text.Body1>Authenticate</Text.Body1>
									</Button>
								}
							>
								<Text.H1>Client ID is not set up</Text.H1>
								<Text.Body1>
									Set up on{" "}
									<A class="underline underline-offset-2" href={AppRoutes.Settings}>
										settings
									</A>{" "}
									page
								</Text.Body1>
							</Show>
						</div>
					</Container>
				</Match>
			</Switch>
		</>
	);
};
