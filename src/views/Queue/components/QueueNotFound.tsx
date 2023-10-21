import { IGuild } from "@api";
import { AbbreviationIcon, Divider, Text } from "@components/atoms";
import { Item } from "@components/molecules";
import { useApi } from "@hooks/useApi";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { Component, For, Show, createSignal } from "solid-js";

type VoiceChannelMin = {
	id: string;
	name: string;
};

type TextChannel = {
	id: string;
	name: string;
};

type Props = {
	guild: IGuild;
	voiceChannel: VoiceChannelMin;
	textChannel: TextChannel | null;
	isLoading: boolean;
	onClick: (voiceChannel: VoiceChannelMin, textChannel: TextChannel | null) => void;
};

const VoiceChannelList: Component<Props> = (props) => {
	return (
		<Item.List
			onClick={() => props.onClick(props.voiceChannel, props.textChannel)}
			title={
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
			}
			icon={props.guild.icon || undefined}
			extra={() => <Text.Body2 truncate>{props.guild.name}</Text.Body2>}
			left={() =>
				!props.guild.icon ? <AbbreviationIcon text={props.guild.name} extraClass="w-12 h-12" /> : undefined
			}
		/>
	);
};

export const QueueNotFound: Component = () => {
	const app = useApp();
	const api = useApi();
	const queue = useQueue();
	const [isLoading, setIsLoading] = createSignal(false);

	const join = async (voiceChannel: VoiceChannelMin, textChannel: TextChannel | null) => {
		setIsLoading(true);
		const success = await api.player.join(voiceChannel.id, textChannel?.id);
		if (!success) {
			setIsLoading(false);
			app.setConfirmation({
				title: "Failed",
				message: () => (
					<div class="flex-col-center">
						<Text.Body1 class="text-center">
							Failed to join <b>{voiceChannel.name}</b>
						</Text.Body1>
					</div>
				),
				isAlert: true,
			});
		}
	};

	return (
		<div class="space-y-4 h-full overflow-y-auto">
			<Text.H2>Queue Not Found</Text.H2>

			<Divider />

			<Show when={queue.voiceChannelHistory.length}>
				<Text.H3>Are you in one of these voice channels?</Text.H3>

				<div class="flex-col-center w-full space-y-3 md:max-w-lg">
					<For each={queue.voiceChannelHistory}>
						{(history) => <VoiceChannelList {...history} isLoading={isLoading()} onClick={join} />}
					</For>
				</div>
			</Show>
		</div>
	);
};
