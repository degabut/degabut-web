import { IPlaylistCompact, IVideoCompact } from "@api";
import { Divider } from "@components/Divider";
import { Icon } from "@components/Icon";
import { Modal } from "@components/Modal";
import { Select } from "@components/Select";
import { getVideoContextMenu, Video } from "@components/Video";
import { YouTubePlaylist } from "@components/YoutubePlaylist";
import { getYouTubePlaylistContextMenu } from "@components/YoutubePlaylist/utils";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useSearchYouTube } from "@hooks/useSearchYouTube";
import { useNavigate } from "solid-app-router";
import { Component, createSignal, onMount, Show } from "solid-js";

export const QuickAddModal: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const [isModalOpen, setIsModalOpen] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(false);
	const search = useSearchYouTube();

	onMount(() => {
		document.addEventListener("keydown", onKeyDown);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		const target = e.target as Element | null;
		const tagName = target?.tagName.toUpperCase();

		if (
			tagName !== "INPUT" &&
			tagName !== "TEXTAREA" &&
			!isModalOpen() &&
			(e.key.toLowerCase() === "p" || (e.key.toLowerCase() === "k" && e.ctrlKey))
		) {
			e.preventDefault();
			setIsModalOpen(true);
		}
	};

	const onInput = (e: InputEvent) => {
		const value = (e.target as HTMLInputElement).value;
		search.videos.mutate([]);
		search.playlists.mutate([]);
		search.debouncedSetKeyword(value);
	};

	const onClickSubmit = (e: MouseEvent) => {
		e.preventDefault();
		addToQueue();
	};

	const onSubmit = async (e: Event) => {
		e.preventDefault();
		if (!search.keyword() || search.result().length) return;
		addToQueue();
	};

	const onSelect = async (item: IVideoCompact | IPlaylistCompact, _: number, e?: KeyboardEvent | MouseEvent) => {
		if ("duration" in item) {
			// video
			if (!queue.data() || e?.shiftKey) navigate("/app/video/" + item.id);
			else await addToQueue(item);
		} else {
			// playlist
			app.setConfirmation({
				title: "Add Playlist",
				message: (
					<div class="space-y-2">
						<div>
							Add playlist <b>{item.title}</b> to the queue?{" "}
						</div>
						<div class="text-sm">
							This will add <b>{item.videoCount}</b> videos to the queue.
						</div>
					</div>
				),
				onConfirm: () => addToQueue(item),
			});
		}
	};

	const addToQueue = async (item?: IVideoCompact | IPlaylistCompact) => {
		if ((!item && !search.keyword()) || isLoading()) return;
		setIsLoading(true);

		if (item) {
			if ("duration" in item) await queue.addTrackById(item.id);
			else await queue.addYouTubePlaylist(item.id);
		} else {
			await queue.addTrackByKeyword(search.keyword());
		}

		setIsLoading(false);
		setIsModalOpen(false);
		search.setKeyword("");
	};

	return (
		<Modal
			extraContainerClass="absolute bg-neutral-900 w-[48rem] top-[15vh]"
			isOpen={isModalOpen()}
			hideCloseButton
			closeOnEscape
			closeOnPathChange
			disableHashState
			onClickOutside={() => setIsModalOpen(false)}
		>
			<form onSubmit={onSubmit} class="m-4">
				<Select<IVideoCompact | IPlaylistCompact>
					inputProps={{
						rounded: true,
						class: "w-full",
						disabled: isLoading(),
						value: search.keyword(),
						onInput: onInput,
						placeholder: "Search for a song",
						focusOnMount: true,
						prefix: <Icon name="search" size="lg" />,
					}}
					hideOptionOnClickOutside={false}
					extraResultContainerClass="!static w-full !max-h-[50vh] bg-neutral-900 space-y-1.5"
					options={search.result()}
					onSelect={onSelect}
					bottomLabel={
						<Show when={search.result().length}>
							<div class="flex flex-row justify-between px-4 text-sm">
								<div class="flex-row-center space-x-2">
									<div class="border border-neutral-300 px-2 pb-0.5 rounded my-auto">↑</div>
									<div class="border border-neutral-300 px-2 pb-0.5 rounded my-auto">↓</div>
									<div class="text-neutral-300">Navigate</div>
								</div>

								<div class="flex-row-center space-x-2">
									<div class="border border-neutral-300 px-3 py-0.5 rounded">Shift</div>
									<div class="border border-neutral-300 px-3 py-0.5 rounded">Enter</div>
									<div class="text-neutral-300">Open</div>
								</div>

								<Show when={queue.data()}>
									<div class="flex-row-center space-x-2">
										<div class="border border-neutral-300 px-3 py-0.5 rounded">Enter</div>
										<div class="text-neutral-300">Add to Queue</div>
									</div>
								</Show>
							</div>
						</Show>
					}
				>
					{(item, isSelected, i) => {
						if ("duration" in item) {
							return (
								<Video.List
									video={item}
									contextMenu={getVideoContextMenu({
										video: item,
										appStore: app,
										queueStore: queue,
										navigate,
									})}
									extraContainerClass="cursor-pointer px-2 py-1"
									extraContainerClassList={{ "!bg-white/10": isSelected }}
								/>
							);
						} else {
							return (
								<>
									<Show when={i === search.playlistStartIndex()}>
										<div class="flex-row-center w-full space-x-4 my-1">
											<div class="text-sm text-neutral-400">Playlist</div>
											<Divider dark extraClass="flex-grow" />
										</div>
									</Show>
									<YouTubePlaylist.List
										playlist={item}
										contextMenu={getYouTubePlaylistContextMenu({
											appStore: app,
											queueStore: queue,
											playlist: item,
										})}
										extraContainerClass="cursor-pointer px-2 py-1"
										extraContainerClassList={{ "!bg-white/10": isSelected }}
									/>
									<Show when={i === search.playlistEndIndex()}>
										<Divider dark extraClass="flex-grow my-2" />
									</Show>
								</>
							);
						}
					}}
				</Select>

				<button type="submit" class="hidden" disabled={isLoading()} onClick={onClickSubmit} />
			</form>
		</Modal>
	);
};
