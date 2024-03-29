import { useApp } from "@app/hooks";
import { Icon, Item, KeyboardHint, Modal, Select, Text } from "@common/components";
import { MediaUrlId, useMatchMediaUrlId, useSearchable } from "@common/hooks";
import { MediaSource } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { PlaylistConfirmationUtil } from "@playlist/utils";
import { ITrack } from "@queue/apis";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { IVideoCompact, IYouTubePlaylistCompact } from "@youtube/apis";
import { YouTubePlaylist } from "@youtube/components";
import { useSearch } from "@youtube/hooks";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show, createSignal } from "solid-js";

type SelectOptionItem = MediaUrlId | IVideoCompact | IYouTubePlaylistCompact | ITrack;

type Props = {
	isOpen: boolean;
	onDone: () => void;
};

export const QuickSearchModal: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = createSignal(false);
	const matchUrl = useMatchMediaUrlId("");
	const search = useSearch();

	const onInput = (e: InputEvent) => {
		const value = (e.target as HTMLInputElement).value;
		matchUrl.setKeyword(value);
		search.setKeyword(value);
	};

	const onClickSubmit = (e: MouseEvent) => {
		e.preventDefault();
		addToQueue();
	};

	const onSubmit = (e: Event) => {
		e.preventDefault();
		if (!search.keyword() || search.result().length) return;
		addToQueue();
	};

	const onSelect = async (item: SelectOptionItem) => {
		if ("requestedBy" in item) navigate("/queue");
		else if ("duration" in item) {
			if (!queue.data.empty) await addToQueue(item);
		} else if ("videoCount" in item) {
			// playlist
			app.setConfirmation(PlaylistConfirmationUtil.addPlaylistConfirmation(item, () => addToQueue(item)));
		} else {
			await queue.addTrackById(item);
			props.onDone();
		}
	};

	const addToQueue = async (item?: SelectOptionItem) => {
		if ((!item && !search.keyword()) || isLoading()) return;
		setIsLoading(true);

		if (item) {
			if ("duration" in item) await queue.addTrackById(`youtube/${item.id}`);
			else if ("videoCount" in item) await queue.addYouTubePlaylist(item.id);
		} else {
			await queue.addTrackByKeyword(search.keyword());
		}

		setIsLoading(false);
		props.onDone();
		search.setKeyword("");
	};

	const tracks = useSearchable({
		keyword: search.keyword,
		items: () => queue.data.tracks || [],
		keys: ({ mediaSource, requestedBy }) => {
			const keys = [mediaSource.title, requestedBy.displayName, requestedBy.nickname, requestedBy.username];
			if (mediaSource.creator) keys.push(mediaSource.creator);
			return keys;
		},
		returnEmptyOnEmptyKeyword: true,
	});

	const items = () => {
		const i: SelectOptionItem[] = [...tracks(), ...search.result()];
		if (!queue.data.empty) i.unshift(...matchUrl.ids());
		return i;
	};

	return (
		<Modal
			extraContainerClass="absolute w-[48rem] top-[15vh]"
			isOpen={props.isOpen}
			hideCloseButton
			closeOnEscape
			closeOnPathChange
			disableHashState
			handleClose={() => props.onDone()}
		>
			<form onSubmit={onSubmit} class="m-4">
				<Select<SelectOptionItem>
					inputProps={{
						rounded: true,
						class: "w-full",
						disabled: isLoading(),
						value: search.keyword(),
						onInput: onInput,
						placeholder: "Search for a song",
						focusOnMount: true,
						prefix: () => <Icon name="search" size="lg" extraClass="fill-current" />,
					}}
					hideOptionOnClickOutside={false}
					extraResultContainerClass="max-h-[50vh]"
					options={items()}
					onSelect={onSelect}
					hint={() => (
						<Show when={search.result().length}>
							<div class="flex flex-row justify-between px-4 text-sm">
								<KeyboardHint keys={["↑", "↓"]} label="Navigate" />
								<Show when={!queue.data.empty}>
									<KeyboardHint key="Enter" label="Add to Queue" />
								</Show>
							</div>
						</Show>
					)}
				>
					{(item, isSelected) => {
						const extraContainerClass = { "!bg-white/10": isSelected };

						if ("mediaSource" in item || "duration" in item) {
							const mediaSource =
								"mediaSource" in item ? item.mediaSource : MediaSourceFactory.fromYoutubeVideo(item);
							return (
								<MediaSource.List
									mediaSource={mediaSource}
									inQueue={queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id)}
									onClick={() => {}} // TODO
									contextMenu={MediaSourceContextMenuUtil.getContextMenu({
										mediaSource,
										appStore: app,
										openWithClick: false,
										queueStore: queue,
										navigate,
									})}
									extraContainerClassList={extraContainerClass}
								/>
							);
						} else if ("videoCount" in item) {
							return (
								<YouTubePlaylist.List
									playlist={item}
									contextMenu={YouTubeContextMenuUtil.getPlaylistContextMenu({
										appStore: app,
										queueStore: queue,
										playlist: item,
									})}
									extraContainerClass="cursor-pointer px-2 py-1"
									extraContainerClassList={extraContainerClass}
								/>
							);
						} else {
							return (
								<Item.Hint
									extraContainerClassList={extraContainerClass}
									label={() => <Text.Body1 truncate>Add {item.label} to queue</Text.Body1>}
									icon="plus"
								/>
							);
						}
					}}
				</Select>

				<button type="submit" class="hidden" disabled={isLoading()} onClick={onClickSubmit} />
			</form>
		</Modal>
	);
};
