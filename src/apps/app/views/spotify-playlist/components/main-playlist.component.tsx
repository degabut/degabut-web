import { ContextMenuButton, Text } from "@common/components";
import { Component } from "solid-js";

type Props = {
	name: string;
	imageUrl: string;
	onAddToQueue: () => void;
};

export const MainPlaylist: Component<Props> = (props) => {
	return (
		<div class="flex-row-center space-x-4">
			<img class="w-24 h-24 rounded" src={props.imageUrl} title={props.name} alt={props.name} />

			<div class="space-y-4 flex-grow truncate">
				<div class="flex-row-center justify-between md:justify-start md:space-x-8">
					<Text.H1 truncate title={props.name}>
						{props.name}
					</Text.H1>
				</div>
			</div>

			<ContextMenuButton
				contextMenu={{
					items: [
						{
							label: "Add to Queue",
							icon: "plus",
							onClick: props.onAddToQueue,
						},
					],
				}}
			/>
		</div>
	);
};