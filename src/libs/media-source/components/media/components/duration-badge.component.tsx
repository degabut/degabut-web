import { Text, TimeUtil } from "@common";
import type { Component } from "solid-js";

type Props = {
	duration: number;
};

export const DurationBadge: Component<Props> = (props) => {
	return (
		<Text.Caption2 light class="border border-neutral-600 rounded px-0.5">
			{TimeUtil.secondsToTime(props.duration)}
		</Text.Caption2>
	);
};
