import { MediaSourceTypes } from "@media-source/apis";
import { Component } from "solid-js";

type Props = {
	type: MediaSourceTypes;
};

export const SourceBadge: Component<Props> = (props) => {
	return (
		<img
			src={props.type === MediaSourceTypes.Spotify ? "/img/spotify.png" : "/img/youtube.png"}
			class="w-4 aspect-square"
			title={props.type === MediaSourceTypes.Spotify ? "Spotify" : "YouTube"}
		/>
	);
};
