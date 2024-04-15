import { AbbreviationIcon, Item, Text } from "@common";
import { Show, type Component } from "solid-js";
import { type IGuild, type ITextChannel, type IVoiceChannelMin } from "../../apis";

type VoiceChannelListProps = {
	guild: IGuild;
	voiceChannel: IVoiceChannelMin;
	textChannel: ITextChannel | null;
	onClick: (voiceChannel: IVoiceChannelMin, textChannel: ITextChannel | null) => void;
	onClickRemove: (voiceChannel: IVoiceChannelMin, textChannel: ITextChannel | null) => void;
};

export const VoiceChannelList: Component<VoiceChannelListProps> = (props) => {
	return (
		<Item.List
			onClick={() => props.onClick(props.voiceChannel, props.textChannel)}
			contextMenu={{
				items: [
					{
						label: "Join",
						icon: "play",
						onClick: () => props.onClick(props.voiceChannel, props.textChannel),
					},
					{
						label: "Remove",
						icon: "closeLine",
						onClick: () => props.onClickRemove(props.voiceChannel, props.textChannel),
					},
				],
			}}
			title={() => (
				<div class="flex space-x-2">
					<Text.H4 truncate>{props.voiceChannel.name}</Text.H4>
					<Show when={props.textChannel} keyed>
						{(textChannel) => (
							<Text.Caption1 truncate class="mt-0.5">
								#{textChannel.name}
							</Text.Caption1>
						)}
					</Show>
				</div>
			)}
			imageUrl={props.guild.icon || undefined}
			extra={() => <Text.Body2 truncate>{props.guild.name}</Text.Body2>}
			left={() =>
				!props.guild.icon ? <AbbreviationIcon text={props.guild.name} extraClass="w-12 h-12" /> : undefined
			}
		/>
	);
};
