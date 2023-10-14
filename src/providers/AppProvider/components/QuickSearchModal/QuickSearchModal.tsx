import { ITrack, IVideoCompact, IYouTubePlaylistCompact } from "@api";
import { Divider, Icon, KeyboardHint, Modal, Select } from "@components/atoms";
import { Video, YouTubePlaylist } from "@components/molecules";
import { useQueue } from "@hooks/useQueue";
import { useSearchYouTube } from "@hooks/useSearchYouTube";
import { useSearchable } from "@hooks/useSearchable";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { addPlaylistConfirmation } from "@utils/confirmation";
import { getVideoContextMenu, getYouTubePlaylistContextMenu } from "@utils/contextMenu";
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
	const search = useSearchYouTube();

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
		if ("requestedBy" in item) return;
		if ("duration" in item) {
			// video
			if (queue.data.empty || e?.shiftKey) navigate("/app/video/" + item.id);
			else await addToQueue(item);
		} else {
			// playlist
			app.setConfirmation(addPlaylistConfirmation(item, () => addToQueue(item)));
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
						prefix: <Icon name="search" size="lg" extraClass="fill-current" />,
					}}
					hideOptionOnClickOutside={false}
					extraResultContainerClass="!static w-full !max-h-[50vh] space-y-1.5"
					options={[...tracks(), ...search.result()]}
					onSelect={onSelect}
					hint={
						<Show when={search.result().length}>
							<div class="flex flex-row justify-between px-4 text-sm">
								<KeyboardHint keys={["↑", "↓"]} label="Navigate" />
								<KeyboardHint combination={["Shift", "Enter"]} label="Open" />
								<Show when={!queue.data.empty}>
									<KeyboardHint key="Enter" label="Add to Queue" />
								</Show>
							</div>
						</Show>
					}
				>
					{(item, isSelected, i) => {
						const extraContainerClass = { "!bg-white/10": isSelected };
						if ("requestedBy" in item) {
							return (
								<>
									<Show when={i === 0}>
										<div class="flex-row-center w-full space-x-4 my-1">
											<div class="text-sm text-neutral-400">Queue</div>
											<Divider dark extraClass="grow" />
										</div>
									</Show>
									<Video.List
										video={item.video}
										inQueue
										contextMenu={getVideoContextMenu({
											video: item.video,
											appStore: app,
											queueStore: queue,
											navigate,
										})}
										extraContainerClassList={extraContainerClass}
									/>
								</>
							);
						} else if ("duration" in item) {
							return (
								<Video.List
									video={item}
									inQueue={queue.data.tracks?.some((t) => t.video.id === item.id)}
									contextMenu={getVideoContextMenu({
										video: item,
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
									contextMenu={getYouTubePlaylistContextMenu({
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
