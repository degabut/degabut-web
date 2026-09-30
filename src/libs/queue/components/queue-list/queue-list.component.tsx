import { AbbreviationIcon, Icon, Item, Text } from "@common";
import { Show, type Component } from "solid-js";
import { ITrack, IVoiceChannel, type IGuild } from "../../apis";

type QueueListProps = {
	guild: IGuild;
	voiceChannel: IVoiceChannel;
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
				<div class="flex-row-center space-x-2">
					<Text.H4 truncate>{props.voiceChannel.name}</Text.H4>
				</div>
			)}
			extra={() => (
				<div class="flex-row-center space-x-1.5">
					<Show when={props.nowPlaying}>
						<Icon name="degabut" size="sm" class="text-brand-500! animate-pulse"></Icon>
					</Show>
					<Text.Caption1 truncate>{props.guild.name}</Text.Caption1>

					<Show when={props.nowPlaying} keyed>
						{(nowPlaying) => (
							<>
								<Text.Caption1>—</Text.Caption1>
								<Text.Caption1 truncate>{nowPlaying.mediaSource.title}</Text.Caption1>
							</>
						)}
					</Show>
				</div>
			)}
			imageUrl={props.guild.icon || undefined}
			left={() =>
				!props.guild.icon ? <AbbreviationIcon text={props.guild.name} extraClass="w-12 h-12" /> : undefined
			}
		/>
	);
};
