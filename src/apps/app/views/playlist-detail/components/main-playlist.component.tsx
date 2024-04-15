import { AbbreviationIcon, ContextMenuButton, Text } from "@common";
import type { Component } from "solid-js";

type Props = {
	name: string;
	onClickEdit: () => void;
	onClickAddToQueue: () => void;
	itemCount: number;
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

	const itemCount = () => {
		const count = props.itemCount;
		return count + (count === 1 ? " track" : " tracks");
	};

	return (
		<div class="flex-row-center space-x-4">
			<AbbreviationIcon text={props.name} size="xl" />

			<div class="space-y-4 flex-grow truncate">
				<div class="flex-row-center justify-between md:justify-start md:space-x-8">
					<Text.H1 truncate title={props.name}>
						{props.name}
					</Text.H1>
				</div>
				<div class="flex md:flex-row space-x-8">
					<Text.Body1>{itemCount()}</Text.Body1>
					<Text.Body1>{duration()}</Text.Body1>
				</div>
			</div>

			<ContextMenuButton
				contextMenu={{
					items: [
						// TODO add delete
						{
							label: "Rename",
							icon: "editPencil",
							onClick: props.onClickEdit,
						},
						{
							label: "Add to Queue",
							icon: "plus",
							onClick: props.onClickAddToQueue,
						},
					],
				}}
			/>
		</div>
	);
};
