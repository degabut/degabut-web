import { IPlaylist } from "@api";
import { AbbreviationIcon, Text } from "@components/atoms";
import { Item } from "@components/molecules";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { getRelativeTime } from "@utils/time";
import { Component, Show } from "solid-js";

contextMenu;

type Props = {
	playlist: IPlaylist;
	onClick?: (playlist: IPlaylist) => void;
	contextMenu?: ContextMenuDirectiveParams;
};

export const PlaylistList: Component<Props> = (props) => {
	const videoCountLabel = () => {
		return props.playlist.videoCount === 1 ? "1 video" : props.playlist.videoCount + " videos";
	};

	return (
		<Item.List
			title={props.playlist.name}
			contextMenu={props.contextMenu}
			onClick={() => props.onClick?.(props.playlist)}
			extra={() => (
				<div>
					<Show when={props.playlist.videoCount > 0}>
						<Text.Caption1>{videoCountLabel()}</Text.Caption1>
					</Show>
					<Text.Caption2>
						{props.playlist.videoCount > 0 && " — "} Created {getRelativeTime(props.playlist.createdAt)}
					</Text.Caption2>
				</div>
			)}
			left={() => <AbbreviationIcon text={props.playlist.name} />}
		/>
	);
};
