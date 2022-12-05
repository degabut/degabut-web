import { IPlaylistCompact } from "@api";
import { Icon } from "@components/Icon";
import { Component } from "solid-js";

type Props = {
	playlist: IPlaylistCompact;
	extraClass?: string;
	extraContainerClass?: string;
};

export const PlaylistThumbnail: Component<Props> = (props) => {
	return (
		<div class="bg-black" classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}>
			<img
				src={props.playlist.thumbnails[0]?.url}
				alt={props.playlist.title}
				class="h-12 w-12 object-cover"
				classList={{ [props.extraClass || ""]: !!props.extraClass }}
			/>
		</div>
	);
};

export const PlaylistThumbnailBig: Component<Props> = (props) => {
	return (
		<div
			class="relative flex bg-black"
			classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}
		>
			<div class="flex justify-center mx-auto sm:w-[16rem] sm:h-[10rem]">
				<img
					src={props.playlist.thumbnails.at(-1)?.url}
					alt={props.playlist.title}
					class="h-full object-cover"
					classList={{ [props.extraClass || ""]: !!props.extraClass }}
				/>
			</div>
			<div class="absolute flex-col-center justify-center space-y-1.5 bottom-0 right-0 bg-black/90 h-full w-[35%]">
				<div>{props.playlist.videoCount}</div>
				<Icon name="audioPlaylist" size="md" extraClass="fill-neutral-300" />
			</div>
		</div>
	);
};
