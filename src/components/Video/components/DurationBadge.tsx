import { IVideoCompact } from "@api";
import { Text } from "@components/Text";
import { secondsToTime } from "@utils";
import { Component } from "solid-js";

type Props = {
	video: IVideoCompact;
};

export const DurationBadge: Component<Props> = (props) => {
	return (
		<Text.Caption2 class="border border-neutral-600 rounded px-0.5 text-neutral-300">
			{secondsToTime(props.video.duration)}
		</Text.Caption2>
	);
};
