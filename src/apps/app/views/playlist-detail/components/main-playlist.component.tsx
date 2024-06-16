import { AbbreviationIcon, ContextMenuButton, Text } from "@common";
import { type IPlaylistImage } from "@playlist";
import { Show, type Component } from "solid-js";

type Props = {
	name: string;
	images: IPlaylistImage[];
	onClickEdit: () => void;
	onClickAddToQueue: () => void;
	itemCount: number;
};

export const MainPlaylist: Component<Props> = (props) => {
	const itemCount = () => {
		const count = props.itemCount;
		return count + (count === 1 ? " track" : " tracks");
	};

	return (
		<div class="flex-row-center space-x-4">
			<Show when={props.images.length} fallback={<AbbreviationIcon text={props.name} size="xl" />}>
				<img
					class="rounded w-24 aspect-square object-cover"
					src={props.images.sort((a, b) => b.width - a.width).at(0)?.url}
				/>
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
