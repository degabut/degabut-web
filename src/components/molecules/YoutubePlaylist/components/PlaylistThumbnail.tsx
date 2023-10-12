import { IYouTubeMixPlaylist, IYouTubePlaylist, IYouTubePlaylistCompact } from "@api";
import { Icon } from "@components/atoms";
import { Component } from "solid-js";

type Props = {
	playlist: IYouTubePlaylistCompact | IYouTubePlaylist | IYouTubeMixPlaylist;
	extraClass?: string;
	extraContainerClass?: string;
};

export const PlaylistThumbnail: Component<Props> = (props) => {
	const thumbnail = () => {
		if ("thumbnails" in props.playlist) return props.playlist.thumbnails.at(0)?.url;
		else return props.playlist.videos.at(0)?.thumbnails.at(0)?.url;
	};

	return (
		<img
			loading="lazy"
			referrerpolicy="no-referrer"
			src={thumbnail()}
			alt={props.playlist.title}
			class="h-12 w-12 object-cover rounded"
			classList={{ [props.extraClass || ""]: !!props.extraClass }}
		/>
	);
};

export const PlaylistThumbnailBig: Component<Props> = (props) => {
	const thumbnail = () => {
		if ("thumbnails" in props.playlist) return props.playlist.thumbnails.at(0)?.url;
		else return props.playlist.videos.at(0)?.thumbnails.at(0)?.url;
	};

	return (
		<div class="relative flex" classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}>
			<div class="flex justify-center mx-auto sm:w-[16rem] sm:h-[10rem]">
				<img
					loading="lazy"
					referrerpolicy="no-referrer"
					src={thumbnail()}
					alt={props.playlist.title}
					class="h-full object-cover rounded-md"
					classList={{ [props.extraClass || ""]: !!props.extraClass }}
				/>
			</div>
			<div class="absolute flex-col-center justify-center space-y-1.5 bottom-0 right-0 rounded-r-md bg-black/90 h-full w-[35%]">
				<div>{props.playlist.videoCount}</div>
				<Icon name="audioPlaylist" size="md" extraClass="fill-neutral-300" />
			</div>
		</div>
	);
};
