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
	const countLabel = () => {
		return props.playlist.mediaSourceCount === 1 ? "1 track" : props.playlist.mediaSourceCount + " tracks";
	};

	return (
		<Item.List
			title={props.playlist.name}
			contextMenu={props.contextMenu}
			onClick={() => props.onClick?.(props.playlist)}
			extra={() => (
				<div>
					<Show when={props.playlist.mediaSourceCount > 0}>
						<Text.Caption1>{countLabel()}</Text.Caption1>
					</Show>
					<Text.Caption2>
						{props.playlist.mediaSourceCount > 0 && " — "} Created{" "}
						{TimeUtil.getRelativeTime(props.playlist.createdAt)}
					</Text.Caption2>
				</div>
			)}
			left={() => <AbbreviationIcon text={props.playlist.name} />}
		/>
	);
};
