import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { Component } from "solid-js";

type Props = {
	name: string;
	onClickEdit: () => void;
	videoCount: number;
	duration: number;
};

export const MainPlaylist: Component<Props> = (props) => {
	const duration = () => {
		const totalSeconds = props.duration;

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		let duration = "";
		if (hours > 0) duration += `${hours}h `;
		if (minutes > 0) duration += `${minutes}m `;
		if (seconds > 0) duration += `${seconds}s`;

		return duration;
	};

	const videoCount = () => {
		const count = props.videoCount;
		return count + (count === 1 ? " video" : " videos");
	};

	return (
		<div class="space-y-4">
			<div class="flex-row-center justify-between md:justify-start md:space-x-8">
				<Text.H1 truncate title={props.name}>
					{props.name}
				</Text.H1>
				<Button icon="editPencil" iconSize="md" flat rounded onClick={() => props.onClickEdit()} />
			</div>
			<div class="flex md:flex-row space-x-8">
				<Text.Body1>{videoCount()}</Text.Body1>
				<Text.Body1>{duration()}</Text.Body1>
			</div>
		</div>
	);
};
