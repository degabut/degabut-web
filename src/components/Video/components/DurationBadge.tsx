import { Text } from "@components/Text";
import { secondsToTime } from "@utils/time";
import { Component } from "solid-js";

type Props = {
	duration: number;
};

export const DurationBadge: Component<Props> = (props) => {
	return (
		<Text.Caption2 class="border border-neutral-600 rounded px-0.5 text-neutral-300">
			{secondsToTime(props.duration)}
		</Text.Caption2>
	);
};
