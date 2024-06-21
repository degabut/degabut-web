import { Icon, Select } from "@common";
import { Card } from "@desktop-overlay/components";
import { MediaSource, MediaSourceFactory } from "@media-source";
import { useQueue } from "@queue";
import {
	YouTubeContextMenuUtil,
	YouTubePlaylist,
	useSearch,
	type IVideoCompact,
	type IYouTubePlaylistCompact,
} from "@youtube";
import { createSignal, onCleanup, onMount, type Component } from "solid-js";

type SelectOptionItem = IVideoCompact | IYouTubePlaylistCompact;

export const Search: Component = () => {
	const queue = useQueue()!;

	let inputRef!: HTMLInputElement;
	const [isLoading, setIsLoading] = createSignal(false);
	const search = useSearch();

	onMount(() => window.addEventListener("focus", onFocus));
	onCleanup(() => window.removeEventListener("focus", onFocus));
	const onFocus = () => inputRef.focus();

	const onInput = (e: InputEvent) => {
		const value = (e.target as HTMLInputElement).value;
		search.setKeyword(value);
	};

	const onSelect = async (item: SelectOptionItem) => {
		if (queue.data.empty) return;

		if ("duration" in item) addToQueue(item);
		else await addToQueue(item);
	};

	const addToQueue = async (item: SelectOptionItem) => {
		if (isLoading()) return;
		setIsLoading(true);

		if (item) {
			if ("duration" in item) await queue.addTrackById(`youtube/${item.id}`);
			else await queue.addYouTubePlaylist(item.id);
		} else {
			await queue.addTrackByKeyword(search.keyword());
		}

		setIsLoading(false);
	};

	return (
		<Card extraClass="w-full h-full">
			<Select<SelectOptionItem>
				ref={inputRef}
				inputProps={{
					ref: (r) => (inputRef = r),
					rounded: true,
					class: "w-full",
					disabled: isLoading(),
					value: search.keyword(),
					onInput: onInput,
					placeholder: "Search for a song",
					focusOnMount: true,
					prefix: () => <Icon name="search" size="lg" />,
				}}
				extraResultContainerClass={isLoading() ? "opacity-50 pointer-events-none" : ""}
				hideOptionOnClickOutside={false}
				options={search.result()}
				onSelect={onSelect}
			>
				{(item, isSelected) => {
					const extraContainerClass = { "!bg-white/10": isSelected };
					if ("duration" in item) {
						const mediaSource = MediaSourceFactory.fromYoutubeVideo(item);
						return (
							<MediaSource.List
								mediaSource={mediaSource}
								onClick={() => {}}
								extraContainerClassList={extraContainerClass}
							/>
						);
					} else {
						return (
							<YouTubePlaylist.List
								playlist={item}
								contextMenu={YouTubeContextMenuUtil.getPlaylistContextMenu({
									queueStore: queue,
									playlist: item,
								})}
								onClick={() => {}}
								extraContainerClassList={extraContainerClass}
							/>
						);
					}
				}}
			</Select>
		</Card>
	);
};
