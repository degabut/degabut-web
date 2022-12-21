import { IPlaylist } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { Text } from "@components/Text";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { getRelativeTime } from "@utils/time";
import { Component, Show } from "solid-js";

contextMenu;

type Props = {
	playlist: IPlaylist;
	disableContextMenu?: boolean;
	contextMenu?: ContextMenuDirectiveParams;
	onAddToQueue?: (playlist: IPlaylist) => void;
	onDelete?: (playlist: IPlaylist) => void;
	onClick?: (playlist: IPlaylist) => void;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraTitleClass?: string;
};

export const PlaylistList: Component<Props> = (props) => {
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
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
		>
			<div class="flex flex-col grow shrink space-y-0.5 py-1.5 px-3 truncate">
				<Text.Body1
					truncate
					class="font-normal"
					classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
				>
					{props.playlist.name}
				</Text.Body1>
				<div>
					<Show when={props.playlist.videoCount > 0}>
						<Text.Caption1>{videoCountLabel()}</Text.Caption1>
					</Show>
					<Text.Caption2>
						{props.playlist.videoCount > 0 && " — "} Created {getRelativeTime(props.playlist.createdAt)}
					</Text.Caption2>
				</div>
			</div>
			<Show when={!props.disableContextMenu}>{<ContextMenuButton contextMenu={props.contextMenu} />}</Show>
		</div>
	);
};
