import { Button, Divider, Icon, Text } from "@common/components";
import { TimeUtil } from "@common/utils";
import { useQueue } from "@queue/hooks";
import { Component, For, createSignal } from "solid-js";
import { MemberListModal } from "./member-list-modal.component";

type Props = {
	title: string;
	description: string | number;
};

const InfoItem: Component<Props> = (props) => {
	return (
		<div class="flex flex-row space-x-3">
			<div class="flex flex-col">
				<Text.Caption2>{props.title}</Text.Caption2>
				<Text.Body2 class="my-auto">{props.description}</Text.Body2>
			</div>
		</div>
	);
};

export const QueueInfo: Component = () => {
	const queue = useQueue();

	const [isListenersModalOpen, setIsListenersModalOpen] = createSignal(false);

	const queueDuration = () => {
		return TimeUtil.secondsToTime(
			queue.data.tracks?.reduce((curr, { mediaSource }) => curr + mediaSource.duration, 0) || 0
		);
	};

	return (
		<>
			<div class="flex flex-row space-x-3 md:space-x-4 py-4 truncate overflow-x-auto">
				<InfoItem title="Queue Duration" description={queueDuration()} />

				<Divider vertical />

				<InfoItem title="Track Count" description={queue.data.tracks?.length || 0} />

				<Divider vertical />

				<Button
					class="flex-row-center space-x-1.5 px-2 py-1"
					flat
					onClick={() => setIsListenersModalOpen(true)}
				>
					<Icon name="people" size="lg" class="fill-neutral-500 mx-auto" />

					<div class="flex-row-center overflow-x-clip -space-x-2">
						<For each={queue.data.voiceChannel.members.filter((m) => m.isInVoiceChannel)}>
							{(member) => (
								<div class="rounded-full w-7 h-7 border-neutral-900 border-2">
									<img
										title={member.displayName}
										class="rounded-full"
										src={member.avatar || "/img/avatar.png"}
									/>
								</div>
							)}
						</For>
					</div>
				</Button>
			</div>

			<MemberListModal isOpen={isListenersModalOpen()} handleClose={() => setIsListenersModalOpen(false)} />
		</>
	);
};
