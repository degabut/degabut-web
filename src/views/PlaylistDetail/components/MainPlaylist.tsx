import { Icon } from "@components/Icon";
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
				<div title={props.name} class="text-2xl font-medium truncate">
					{props.name}
				</div>
				<button onClick={() => props.onClickEdit()}>
					<Icon
						name="editPencil"
						size="md"
						extraClass="fill-neutral-300 hover:fill-neutral-100 cursor-pointer"
					/>
				</button>
			</div>
			<div class="flex md:flex-row space-x-8">
				<div>{videoCount()}</div>
				<div>{duration()}</div>
			</div>
		</div>
	);
};
