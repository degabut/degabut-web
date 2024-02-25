import { AbbreviationIcon, ContextMenuButton, Text } from "@common/components";
import { Component, Show } from "solid-js";

type Props = {
	name: string;
	imageUrl: string;
	itemCount: number;
	onAddToQueue: () => void;
};

export const MainPlaylist: Component<Props> = (props) => {
	const itemCount = () => {
		const count = props.itemCount;
		return count + (count === 1 ? " track" : " tracks");
	};

	return (
		<div class="flex-row-center space-x-4">
			<Show when={props.imageUrl} fallback={<AbbreviationIcon text={props.name} size="xl" />}>
				<img class="w-24 h-24 rounded" src={props.imageUrl} title={props.name} alt={props.name} />
			</Show>

			<div class="space-y-4 flex-grow truncate">
				<div class="flex-row-center justify-between md:justify-start md:space-x-8">
					<Text.H1 truncate title={props.name}>
						{props.name}
					</Text.H1>
				</div>
				<div class="flex md:flex-row space-x-8">
					<Text.Body1>{itemCount()}</Text.Body1>
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
