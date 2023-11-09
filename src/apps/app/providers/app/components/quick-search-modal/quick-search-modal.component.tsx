import { useApp } from "@app/hooks";
import { Icon, KeyboardHint, Modal, Select } from "@common/components";
import { useSearchable } from "@common/hooks";
import { PlaylistConfirmationUtil } from "@playlist/utils";
import { ITrack } from "@queue/apis";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { IVideoCompact, IYouTubePlaylistCompact } from "@youtube/apis";
import { Video, YouTubePlaylist } from "@youtube/components";
import { useSearch } from "@youtube/hooks";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show, createSignal } from "solid-js";

type SelectOptionItem = IVideoCompact | IYouTubePlaylistCompact | ITrack;

type Props = {
	isOpen: boolean;
	onDone: () => void;
};

export const QuickSearchModal: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = createSignal(false);
	const search = useSearch();

	const onInput = (e: InputEvent) => {
		const value = (e.target as HTMLInputElement).value;
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

	const onSelect = async (item: SelectOptionItem, _: number, e?: KeyboardEvent | MouseEvent) => {
		if ("requestedBy" in item) navigate("/app/queue");
		else if ("duration" in item) {
			// video
			if (queue.data.empty || e?.shiftKey) navigate("/app/video/" + item.id);
			else await addToQueue(item);
		} else {
			// playlist
			app.setConfirmation(PlaylistConfirmationUtil.addPlaylistConfirmation(item, () => addToQueue(item)));
		}
	};

	const addToQueue = async (item?: SelectOptionItem) => {
		if ((!item && !search.keyword()) || isLoading()) return;
		setIsLoading(true);

		if (item) {
			if ("duration" in item) await queue.addTrackById(item.id);
			else await queue.addYouTubePlaylist(item.id);
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
		keys: ({ video, requestedBy }) => {
			const keys = [video.title, requestedBy.displayName, requestedBy.nickname, requestedBy.username];
			if (video.channel) keys.push(video.channel.name);
			return keys;
		},
		returnEmptyOnEmptyKeyword: true,
	});

	return (
		<Modal
			extraContainerClass="absolute w-[48rem] top-[15vh]"
			isOpen={props.isOpen}
			hideCloseButton
			closeOnEscape
			closeOnPathChange
			disableHashState
			onClickOutside={() => props.onDone()}
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
					options={[...tracks(), ...search.result()]}
					onSelect={onSelect}
					hint={() => (
						<Show when={search.result().length}>
							<div class="flex flex-row justify-between px-4 text-sm">
								<KeyboardHint keys={["↑", "↓"]} label="Navigate" />
								<KeyboardHint combination={["Shift", "Enter"]} label="Open" />
								<Show when={!queue.data.empty}>
									<KeyboardHint key="Enter" label="Add to Queue" />
								</Show>
							</div>
						</Show>
					)}
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
										appStore: app,
										queueStore: queue,
										navigate,
									})}
									extraContainerClassList={extraContainerClass}
								/>
							);
						} else {
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
						}
					}}
				</Select>

				<button type="submit" class="hidden" disabled={isLoading()} onClick={onClickSubmit} />
			</form>
		</Modal>
	);
};
