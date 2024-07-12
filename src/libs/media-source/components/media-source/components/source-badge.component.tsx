import type { Component } from "solid-js";
import { MediaSourceTypes } from "../../../apis";

type Props = {
	type: MediaSourceTypes;
	size?: "md" | "lg";
};

export const SourceBadge: Component<Props> = (props) => {
	return (
		<img
			src={props.type === MediaSourceTypes.Spotify ? "/img/spotify.png" : "/img/youtube.png"}
			class="aspect-square"
			classList={{
				"w-5": props.size === "lg",
				"w-4": !props.size || props.size === "md",
			}}
			title={props.type === MediaSourceTypes.Spotify ? "Spotify" : "YouTube"}
		/>
	);
};
