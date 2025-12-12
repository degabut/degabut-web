import { useApp } from "@app/providers";
import { Button, Icon, Text, useApi } from "@common";
import { useDiscord } from "@discord";
import { PlayerApi, useQueue, VoiceChannelList, type ITextChannel, type IVoiceChannelMin } from "@queue";
import { createSignal, For, Show, type Component } from "solid-js";

export const QueueNotFound: Component = () => {
	const app = useApp()!;
	const api = useApi();
	const discord = useDiscord();
	const queue = useQueue()!;
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
		<Show
			when={discord?.currentChannel()}
			keyed
			fallback={
				<VoiceChannelHistoryList
					onClickChannel={join}
					onRemoveChannel={(v, t) => queue.voiceChannelHistory.deleteHistory(v.id, t?.id)}
				/>
			}
		>
			{(channel) => <JoinCurrentChannel onClickChannel={join} channel={channel} />}
		</Show>
	);
};

type JoinCurrentChannelProps = {
	onClickChannel: (voiceChannel: IVoiceChannelMin, textChannel?: ITextChannel | null) => Promise<void>;
	channel: IVoiceChannelMin;
};

const JoinCurrentChannel: Component<JoinCurrentChannelProps> = (props) => {
	const queue = useQueue()!;
	const [isLoading, setIsLoading] = createSignal(false);

	const handle = async () => {
		try {
			setIsLoading(true);
			await props.onClickChannel(props.channel);
		} catch {
			setIsLoading(false);
		}
	};

	return (
		<div class="flex-row-center justify-center py-4  text-neutral-300">
			<Button disabled={isLoading()} class="px-12 py-2" onClick={() => handle()}>
				<div class="flex-col-center space-y-0.5">
					<Text.Body1>Bring {queue.bot().name} to</Text.Body1>
					<div class="flex-row-center space-x-2">
						<Icon size="xl" name="soundFull" class="text-neutral-500" />
						<Text.H3>{props.channel.name}</Text.H3>
					</div>
				</div>
			</Button>
		</div>
	);
};

type VoiceChannelHistoryListProps = {
	onClickChannel: (voiceChannel: IVoiceChannelMin, textChannel?: ITextChannel | null) => void;
	onRemoveChannel: (voiceChannel: IVoiceChannelMin, textChannel?: ITextChannel | null) => void;
};

const VoiceChannelHistoryList: Component<VoiceChannelHistoryListProps> = (props) => {
	const queue = useQueue()!;

	return (
		<div class="space-y-2 h-full overflow-y-auto">
			<Text.Body1>
				Queue not found{queue.voiceChannelHistory.history.length ? ", select voice channel" : ""}
			</Text.Body1>

			<Show when={queue.voiceChannelHistory.history.length}>
				<div class="flex-col-center space-y-2">
					<For each={queue.voiceChannelHistory.history}>
						{(history) => (
							<VoiceChannelList
								{...history}
								onClick={props.onClickChannel}
								onClickRemove={props.onRemoveChannel}
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
};
