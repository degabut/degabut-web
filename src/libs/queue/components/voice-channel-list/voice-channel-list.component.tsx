import { AbbreviationIcon, Item, Text } from "@common/components";
import { IGuild, ITextChannel, IVoiceChannelMin } from "@queue/apis";
import { Component, Show } from "solid-js";

type VoiceChannelListProps = {
	guild: IGuild;
	voiceChannel: IVoiceChannelMin;
	textChannel: ITextChannel | null;
	onClick: (voiceChannel: IVoiceChannelMin, textChannel: ITextChannel | null) => void;
};

export const VoiceChannelList: Component<VoiceChannelListProps> = (props) => {
	return (
		<Item.List
			onClick={() => props.onClick(props.voiceChannel, props.textChannel)}
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
