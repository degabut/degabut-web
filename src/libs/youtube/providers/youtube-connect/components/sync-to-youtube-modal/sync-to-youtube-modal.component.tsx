import { Button, Checkbox, Divider, Input, Modal, Spinner, Text, useNotification } from "@common";
import { useYouTubeConnect, YouTubeConnectApi } from "@youtube";
import { createEffect, createSignal, Show, type Component } from "solid-js";

type SyncPreview = {
	playlistId: string | null;
	added: number;
	removed: number;
	targetVideoIds: string[];
};

type Props = {
	isOpen: boolean;
	videoIds: string[] | (() => Promise<string[]>);
	defaultPlaylistName: string;
	onClose: () => void;
};

export const SyncToYouTubeModal: Component<Props> = (props) => {
	const youtube = useYouTubeConnect();
	const api = new YouTubeConnectApi(youtube.client);
	const notification = useNotification();

	const [playlistName, setPlaylistName] = createSignal(props.defaultPlaylistName);
	const [removeMissing, setRemoveMissing] = createSignal(true);
	const [isPreviewLoading, setIsPreviewLoading] = createSignal(false);
	const [preview, setPreview] = createSignal<SyncPreview | null>(null);
	const [error, setError] = createSignal("");
	const [isFetching, setIsFetching] = createSignal(false);
	const [isSyncing, setIsSyncing] = createSignal(false);

	createEffect(() => {
		if (props.isOpen) {
			setPlaylistName(props.defaultPlaylistName);
			setRemoveMissing(true);
			setPreview(null);
			setError("");
		}
	});

	const onNext = async () => {
		const name = playlistName().trim();
		if (!name) return setError("Playlist name is required");

		setIsFetching(true);
		const videoIds = typeof props.videoIds === "function" ? await props.videoIds() : props.videoIds;
		setIsFetching(false);
		if (!videoIds.length) return setError("No YouTube videos in this list to sync");

		setIsPreviewLoading(true);
		setError("");
		try {
			const api = new YouTubeConnectApi(youtube.client);
			const playlistId = await api.findPlaylistByTitle(name);
			if (!playlistId) {
				setPreview({
					playlistId: null,
					added: videoIds.length,
					removed: 0,
					targetVideoIds: videoIds,
				});
				return;
			}

			const result = await api.getPlaylistVideos(playlistId);
			if (!result) throw new Error(`Failed to get videos for playlist "${name}"`);

			const existingIds = new Set(result.videos.map((i) => i.id));
			const targetIds = new Set(videoIds);

			const added = videoIds.filter((id) => !existingIds.has(id)).length;
			const removed = removeMissing() ? result.videos.filter((i) => !targetIds.has(i.id)).length : 0;

			setPreview({ playlistId, added, removed, targetVideoIds: videoIds });
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to preview sync");
		} finally {
			setIsPreviewLoading(false);
		}
	};

	const getOrCreatePlaylist = async (title: string) => {
		const existing = await api.findPlaylistByTitle(title);
		if (existing) return existing;

		const created = await youtube.client.playlists.insert(title, "Synced from Degabut");
		return created?.id || null;
	};

	const onSynchronize = async () => {
		const current = preview();
		if (!current) return;

		const name = playlistName().trim();
		setIsSyncing(true);
		setError("");
		notification.push({ message: () => `Synchronizing to ${name}...` });

		try {
			const playlistId = await getOrCreatePlaylist(name);
			if (!playlistId) throw new Error(`Failed to get or create playlist "${name}"`);

			const result = await api.getPlaylistVideos(playlistId);
			if (!result) throw new Error(`Failed to get videos for playlist "${name}"`);

			const existingIds = new Set(result.videos.map((i) => i.id));
			const targetIds = new Set(current.targetVideoIds);

			const toRemove = removeMissing() ? result.videos.filter((i) => !targetIds.has(i.id)) : [];
			const toAdd = current.targetVideoIds.filter((id) => !existingIds.has(id));

			let added = 0;
			for (const id of toAdd) {
				try {
					await api.addToPlaylist(playlistId, id);
					added++;
				} catch (e) {
					console.error(`Failed to add video ${id} to playlist ${playlistId}`, e);
				}
			}

			let removed = 0;
			for (const item of toRemove) {
				try {
					await youtube.client.playlistItems.remove(item.id);
					removed++;
				} catch (e) {
					console.error(`Failed to remove video ${item.id} from playlist ${playlistId}`, e);
				}
			}

			notification.push({
				message: () => `Synced to "${name}"! ${added} added, ${removed} removed`,
			});
			props.onClose();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to sync");
		}
	};

	return (
		<Modal
			isOpen={props.isOpen}
			handleClose={props.onClose}
			extraContainerClass="w-[28rem] max-h-[90vh]"
			closeOnEscape
		>
			<div class="flex flex-col space-y-4 p-6">
				<Text.H2 class="text-center">Sync to YouTube</Text.H2>
				<Divider />

				<div class="flex flex-col space-y-1.5">
					<Text.Body1>YouTube Playlist name</Text.Body1>
					<Input
						value={playlistName()}
						onInput={(e) => setPlaylistName(e.currentTarget.value)}
						disabled={isPreviewLoading() || isSyncing() || isFetching() || !!preview()}
						outlined
						class="w-full"
					/>
					<Text.Caption2>
						If playlist with this name doesn't exist, it will be created, otherwise it will be updated
					</Text.Caption2>
				</div>

				<label
					class="flex flex-row items-center space-x-2 cursor-pointer select-none"
					classList={{ "opacity-50 pointer-events-none": !!preview() }}
				>
					<Checkbox checked={removeMissing()} onChange={setRemoveMissing} />
					<Text.Caption1>Remove videos that are no longer in this playlist</Text.Caption1>
				</label>

				<Show when={preview()} keyed>
					{(p) => (
						<div class="flex flex-col space-y-1.5 py-2 px-3 rounded-lg border border-yellow-500 bg-yellow-200/25">
							<Text.Body2 class="text-yellow-300!">
								This action will{" "}
								<b>
									add {p.added} video{p.added === 1 ? "" : "s"}
								</b>{" "}
								and{" "}
								<b>
									remove {p.removed} video
									{p.removed === 1 ? "" : "s"}
								</b>{" "}
								from the playlist
							</Text.Body2>
							<Text.Caption2 class="text-yellow-400!">Click Synchronize to proceed</Text.Caption2>
						</div>
					)}
				</Show>

				<Show when={error()}>
					<Text.Caption1 class="text-red-500 text-center">{error()}</Text.Caption1>
				</Show>

				<Show
					when={!preview()}
					fallback={
						<Button
							fill
							theme="brand"
							rounded
							class="px-6 py-2 justify-center"
							disabled={isSyncing()}
							onClick={onSynchronize}
						>
							<Show
								when={isSyncing()}
								fallback={<Text.Body1 class="font-medium">Synchronize</Text.Body1>}
							>
								<Spinner size="sm" />
							</Show>
						</Button>
					}
				>
					<Button
						fill
						theme="brand"
						rounded
						class="px-6 py-2 justify-center"
						disabled={isPreviewLoading()}
						onClick={onNext}
					>
						<Show
							when={isPreviewLoading() || isFetching()}
							fallback={<Text.Body1 class="font-medium">Next</Text.Body1>}
						>
							<Spinner size="sm" />
						</Show>
					</Button>
				</Show>
			</div>
		</Modal>
	);
};
