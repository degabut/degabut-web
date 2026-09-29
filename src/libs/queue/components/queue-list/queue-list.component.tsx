import { AbbreviationIcon, Icon, Item, Text } from "@common";
import { type Component } from "solid-js";
import { ITrack, type IGuild } from "../../apis";

type QueueListProps = {
	guild: IGuild;
	nowPlaying?: ITrack | null;
	onClick: (guild: IGuild) => void;
};

export const QueueList: Component<QueueListProps> = (props) => {
	return (
		<Item.List
			onClick={() => props.onClick(props.guild)}
			contextMenu={{
				items: [
					{
						label: "Connect",
						icon: "play",
						onClick: () => props.onClick(props.guild),
					},
				],
			}}
			title={() => (
				<div class="flex space-x-2">
					<Text.H4 truncate>{props.guild.name}</Text.H4>
				</div>
			)}
			extra={() =>
				props.nowPlaying ? (
					<div class="flex-row-center space-x-1.5">
						<Icon name="degabut" size="sm" class="text-brand-500! animate-pulse"></Icon>
						<Text.Caption1 truncate>{props.nowPlaying.mediaSource.title}</Text.Caption1>
					</div>
				) : undefined
			}
			imageUrl={props.guild.icon || undefined}
			left={() =>
				!props.guild.icon ? <AbbreviationIcon text={props.guild.name} extraClass="w-12 h-12" /> : undefined
			}
		/>
	);
};
