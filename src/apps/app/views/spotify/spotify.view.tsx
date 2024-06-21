import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { A, Button, Container, Icon, Text, useScreen } from "@common";
import { SPOTIFY_CLIENT_ID } from "@constants";
import { useSettings } from "@settings";
import { useSpotify } from "@spotify";
import { Show, onMount, type Component } from "solid-js";
import { Library, Tracks } from "./components";

export const Spotify: Component = () => {
	const app = useApp()!;
	const spotify = useSpotify();
	const screen = useScreen();
	const { settings } = useSettings();

	onMount(() => app.setTitle("Spotify"));

	return (
		<Show
			when={!spotify.isConnected()}
			fallback={
				<Show
					when={screen.gte.lg}
					fallback={
						<Container size="full" extraClass="space-y-8">
							<Library />
							<Tracks />
						</Container>
					}
				>
					<div class="h-full flex flex-row space-x-2">
						<Container fit size="full" extraClass="max-w-md">
							<Show when={spotify.playlists.data() || spotify.albums.data()} keyed>
								<Library />
							</Show>
						</Container>

						<Container>
							<Tracks />
						</Container>
					</div>
				</Show>
			}
		>
			<Container size="full" extraClass="flex-col-center justify-center h-full space-y-12">
				<Icon name="spotify" class="text-neutral-700 w-32 h-32" />

				<div class="flex-col-center space-y-4 text-center">
					<Show
						when={!SPOTIFY_CLIENT_ID && !settings["spotify.clientId"]}
						fallback={
							<>
								<Button rounded class="px-8 py-2.5" onClick={spotify.authenticate}>
									<Text.Body1>Authenticate</Text.Body1>
								</Button>
							</>
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
		</Show>
	);
};
