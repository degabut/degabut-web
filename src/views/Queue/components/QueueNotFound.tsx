import { IGuild } from "@api";
import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Divider } from "@components/Divider";
import { Text } from "@components/Text";
import { useApi } from "@hooks/useApi";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { Component, createSignal, For, Show } from "solid-js";

type VoiceChannelMin = {
	id: string;
	name: string;
};

type Props = {
	guild: IGuild;
	voiceChannel: VoiceChannelMin;
	isLoading: boolean;
	onClick: (voiceChannel: VoiceChannelMin) => void;
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
			<div class="shrink-0 w-14 h-14 p-1 rounded-full">
				<Show
					when={props.guild.icon}
					keyed
					fallback={<div class="flex-col-center h-full justify-center text-xl">{shortName()}</div>}
				>
					{(icon) => <img src={icon} />}
				</Show>
			</div>

			<div class="flex flex-col grow truncate">
				<Text.H4 truncate>{props.voiceChannel.name}</Text.H4>
				<Text.Body2 truncate>{props.guild.name}</Text.Body2>
			</div>

			<Button disabled={props.isLoading} onClick={() => props.onClick(props.voiceChannel)} class="px-4 py-2">
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

	const join = async (voiceChannel: VoiceChannelMin) => {
		setIsLoading(true);
		const success = await api.player.join(voiceChannel.id);
		if (!success) {
			setIsLoading(false);
			app.setConfirmation({
				title: "Failed",
				message: () => (
					<>
						Failed to join <b>{voiceChannel.name}</b>
					</>
				),
				isAlert: true,
			});
		}
	};

	return (
		<Container size="full" extraClass="flex-col-center mt-6 space-y-6">
			<Text.H1>Queue Not Found</Text.H1>

			<Divider extraClass="max-w-lg" />

			<Show when={queue.voiceChannelHistory.length}>
				<div class="flex-col-center text-center">
					<Text.H3>Are you in one of these voice channels?</Text.H3>
					<Text.Body2>
						Click the <b>Join</b> button to make Degabut join the voice channel.
					</Text.Body2>
				</div>

				<div class="flex-col-center w-full space-y-4 max-w-lg">
					<For each={queue.voiceChannelHistory}>
						{(history) => <VoiceChannelList {...history} isLoading={isLoading()} onClick={join} />}
					</For>
				</div>
			</Show>
		</Container>
	);
};
