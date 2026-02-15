import { AbbreviationIcon, Item, Text } from "@common";
import { type Component } from "solid-js";
import { type IGuild } from "../../apis";

type GuildListProps = {
	guild: IGuild;
	description?: string;
	onClick: (guild: IGuild) => void;
};

export const GuildList: Component<GuildListProps> = (props) => {
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
			extra={() => (props.description ? <Text.Body2 truncate>{props.description}</Text.Body2> : undefined)}
			imageUrl={props.guild.icon || undefined}
			left={() =>
				!props.guild.icon ? <AbbreviationIcon text={props.guild.name} extraClass="w-12 h-12" /> : undefined
			}
		/>
	);
};
