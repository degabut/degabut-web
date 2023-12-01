import { Text } from "@common/components";
import { IRecap } from "@user/apis";
import { Component } from "solid-js";

type ActivityProps = {
	title: string;
	value: string | number;
	big?: boolean;
};

const Activity: Component<ActivityProps> = (props) => {
	return (
		<div class="flex-col-center space-y-2 text-center">
			<Text.Body1 classList={{ "text-xl": props.big }}>{props.title}</Text.Body1>
			<Text.H1 classList={{ "text-2xl": props.big }}>{props.value}</Text.H1>
		</div>
	);
};

type ActivitySectionProps = {
	recap: IRecap;
};

export const ActivitySection: Component<ActivitySectionProps> = (props) => {
	return (
		<div class="flex-col-center space-y-12 w-full max-w-xl">
			<div class="grid grid-cols-2 items-center gap-y-8 w-full">
				<Activity big title="Song Played" value={props.recap.songPlayed} />
				<Activity big title="Listened for" value={`${Math.floor(props.recap.durationPlayed / 60)} mins`} />
			</div>

			<Activity title="Unique Song Played" value={props.recap.uniqueSongPlayed} />
		</div>
	);
};
