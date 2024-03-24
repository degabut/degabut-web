import { useApp } from "@app/hooks";
import { Text } from "@common/components";
import { useApi } from "@common/hooks";
import { useDiscord } from "@discord/hooks";
import { ITextChannel, IVoiceChannelMin, PlayerApi } from "@queue/apis";
import { Component, Show } from "solid-js";
import { JoinCurrentChannel, VoiceChannelHistoryList } from "./components";

export const QueueNotFound: Component = () => {
	const discord = useDiscord();
	const app = useApp();
	const api = useApi();
	const playerApi = new PlayerApi(api.client);

	const join = async (voiceChannel: IVoiceChannelMin, textChannel?: ITextChannel | null) => {
		const success = await playerApi.join(voiceChannel.id, textChannel?.id);
		if (!success) {
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
		<Show when={discord?.currentChannel()} keyed fallback={<VoiceChannelHistoryList onClickChannel={join} />}>
			{(channel) => <JoinCurrentChannel onClickChannel={join} channel={channel} />}
		</Show>
	);
};
