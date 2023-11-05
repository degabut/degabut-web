import { AbbreviationIcon, Item, Text } from "@common/components";
import { ContextMenuDirectiveParams, contextMenu } from "@common/directives";
import { TimeUtil } from "@common/utils";
import { IPlaylist } from "@playlist/apis";
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
						{props.playlist.videoCount > 0 && " — "} Created{" "}
						{TimeUtil.getRelativeTime(props.playlist.createdAt)}
					</Text.Caption2>
				</div>
			)}
			left={() => <AbbreviationIcon text={props.playlist.name} />}
		/>
	);
};
