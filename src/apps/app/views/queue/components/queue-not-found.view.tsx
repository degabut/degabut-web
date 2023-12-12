import { useApp } from "@app/hooks";
import { Divider, Text } from "@common/components";
import { useApi } from "@common/hooks";
import { ITextChannel, IVoiceChannelMin, PlayerApi } from "@queue/apis";
import { VoiceChannelList } from "@queue/components";
import { useQueue } from "@queue/hooks";
import { Component, For, Show } from "solid-js";

export const QueueNotFound: Component = () => {
	const app = useApp();
	const api = useApi();
	const playerApi = new PlayerApi(api.client);
	const queue = useQueue();

	const join = async (voiceChannel: IVoiceChannelMin, textChannel: ITextChannel | null) => {
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
		<div class="space-y-4 h-full overflow-y-auto">
			<Text.H2>Queue Not Found</Text.H2>

			<Divider />

			<Show when={queue.voiceChannelHistory.length}>
				<Text.H3>Are you in one of these voice channels?</Text.H3>

				<div class="flex-col-center w-full space-y-3 md:max-w-lg">
					<For each={queue.voiceChannelHistory}>
						{(history) => <VoiceChannelList {...history} onClick={join} />}
					</For>
				</div>
			</Show>
		</div>
	);
};
