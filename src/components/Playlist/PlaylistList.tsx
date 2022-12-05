import { IPlaylist } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { contextMenu } from "@directives/contextMenu";
import { getRelativeTime } from "@utils";
import { Component, createMemo, Show } from "solid-js";
import { playlistContextMenu } from "./utils";

contextMenu;

type Props = {
	playlist: IPlaylist;
	disableContextMenu?: boolean;
	onAddToQueue?: (playlist: IPlaylist) => void;
	onDelete?: (playlist: IPlaylist) => void;
	onClick?: (playlist: IPlaylist) => void;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraTitleClass?: string;
};

export const PlaylistList: Component<Props> = (props) => {
	const contextMenuProps = createMemo(() => {
		const contextMenu = playlistContextMenu({
			playlist: props.playlist,
			onDelete: props.onDelete,
			onAddToQueue: props.onAddToQueue,
		});

		return {
			items: contextMenu.items,
			header: contextMenu.header,
		};
	});

	const videoCountLabel = () => {
		return props.playlist.videoCount === 1 ? "1 video" : props.playlist.videoCount + " videos";
	};

	return (
		<div
			class="flex-row-center space-x-1.5 md:space-x-3 w-full h-[3.625rem] md:pr-2 bg-white/5 hover:bg-white/10 rounded cursor-pointer"
			classList={{
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			onClick={() => props.onClick?.(props.playlist)}
			use:contextMenu={props.disableContextMenu ? undefined : contextMenuProps()}
		>
			<div class="flex flex-col flex-grow flex-shrink space-y-0.5 py-1.5 px-3 truncate">
				<div class="truncate" classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}>
					{props.playlist.name}
				</div>
				<div class="items-center text-sm text-neutral-400">
					<Show when={props.playlist.videoCount > 0}>
						<span>{videoCountLabel()}</span>
					</Show>
					<span class="text-xs">
						{props.playlist.videoCount > 0 && " — "} Created {getRelativeTime(props.playlist.createdAt)}
					</span>
				</div>
			</div>
			<Show when={!props.disableContextMenu}>{<ContextMenuButton contextMenu={contextMenuProps()} />}</Show>
		</div>
	);
};
