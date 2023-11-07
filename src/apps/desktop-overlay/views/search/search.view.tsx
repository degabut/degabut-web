import { useQueue } from "@app/hooks";
import { Icon, Select } from "@common/components";
import { Card } from "@desktop-overlay/components";
import { ITrack } from "@queue/apis";
import { IVideoCompact, IYouTubePlaylistCompact } from "@youtube/apis";
import { Video, YouTubePlaylist } from "@youtube/components";
import { useSearch } from "@youtube/hooks";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, createSignal } from "solid-js";

type SelectOptionItem = IVideoCompact | IYouTubePlaylistCompact | ITrack;

export const Search: Component = () => {
	const queue = useQueue();

	const [isLoading, setIsLoading] = createSignal(false);
	const search = useSearch();

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
			if ("duration" in item) await queue.addTrackById(item.id);
			else await queue.addYouTubePlaylist(item.id);
		} else {
			await queue.addTrackByKeyword(search.keyword());
		}

		setIsLoading(false);
	};

	return (
		<Card extraClass="w-full h-full">
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
				options={search.result()}
				onSelect={onSelect}
			>
				{(item, isSelected) => {
					const extraContainerClass = { "!bg-white/10": isSelected };
					if ("video" in item || "duration" in item) {
						const video = "video" in item ? item.video : item;
						return (
							<Video.List
								video={video}
								inQueue={queue.data.tracks?.some((t) => t.video.id === video.id)}
								onClick={() => {}} // TODO
								contextMenu={YouTubeContextMenuUtil.getVideoContextMenu({
									video,
									queueStore: queue,
								})}
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
								extraContainerClass="cursor-pointer px-2 py-1"
								extraContainerClassList={extraContainerClass}
							/>
						);
					}
				}}
			</Select>
		</Card>
	);
};
