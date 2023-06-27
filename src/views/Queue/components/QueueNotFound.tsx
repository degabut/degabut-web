import { IGuild } from "@api";
import { Button } from "@components/Button";
import { Divider } from "@components/Divider";
import { Text } from "@components/Text";
import { useApi } from "@hooks/useApi";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { Component, createSignal, For, Show } from "solid-js";

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
	const shortName = () =>
		props.guild.name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.slice(0, 2);

	return (
		<div class="flex-row-center px-2 py-1 space-x-2 w-full bg-white/5 rounded">
			<div class="shrink-0 w-12 h-12 p-1 rounded-full">
				<Show
					when={props.guild.icon}
					keyed
					fallback={<div class="flex-col-center h-full justify-center text-xl">{shortName()}</div>}
				>
					{(icon) => <img src={icon} />}
				</Show>
			</div>

			<div class="flex flex-col grow truncate">
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
				<Text.Body2 truncate>{props.guild.name}</Text.Body2>
			</div>

			<Button
				disabled={props.isLoading}
				onClick={() => props.onClick(props.voiceChannel, props.textChannel)}
				class="px-3 py-1.5"
			>
				Join
			</Button>
		</div>
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
				<Text.Body2>
					Click the <b>Join</b> button to make Degabut join the voice channel.
				</Text.Body2>

				<div class="flex-col-center w-full space-y-3 md:max-w-lg">
					<For each={queue.voiceChannelHistory}>
						{(history) => <VoiceChannelList {...history} isLoading={isLoading()} onClick={join} />}
					</For>
				</div>
			</Show>
		</div>
	);
};
