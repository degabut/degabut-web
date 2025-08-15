import { Button, Divider, Icon, Switch, Text, TimeUtil } from "@common";
import { useQueue } from "@queue";
import { type Accessor, type Component, For, type JSX, Show, createSignal } from "solid-js";
import { MemberListModal } from "./member-list-modal.component";

type Props = {
	title: string;
	description: string | number | Accessor<JSX.Element>;
	horizontal?: boolean;
	extraClass?: string;
};

const InfoItem: Component<Props> = (props) => {
	return (
		<div class="flex space-x-3" classList={{ [props.extraClass || ""]: !!props.extraClass }}>
			<div
				class="flex"
				classList={{
					"flex-col md:flex-row md:items-center md:space-x-1.5": props.horizontal,
					"flex-col": !props.horizontal,
				}}
			>
				<Text.Caption2>{props.title}</Text.Caption2>
				{typeof props.description === "function" ? (
					props.description()
				) : (
					<Text.Body2 class="my-auto">{props.description}</Text.Body2>
				)}
			</div>
		</div>
	);
};

export const QueueInfo: Component = () => {
	const queue = useQueue()!;

	const [isListenersModalOpen, setIsListenersModalOpen] = createSignal(false);

	const queueDuration = () => {
		if (queue.data.empty) return "-";
		return TimeUtil.secondsToTime(
			queue.data.tracks?.reduce((curr, { mediaSource }) => curr + mediaSource.duration, 0) || 0
		);
	};

	return (
		<>
			<div class="flex flex-row flex-wrap justify-between md:justify-start gap-x-3 md:gap-x-0 space-x-0 md:space-x-5 truncate">
				<InfoItem title="Queue Duration" description={queueDuration()} extraClass="flex-1 md:flex-grow-0" />

				<Divider vertical dark />

				<InfoItem
					title="Track Count"
					description={!queue.data.empty ? queue.data.tracks?.length || 0 : "-"}
					extraClass="flex-1 md:flex-grow-0"
				/>

				<Divider vertical dark />

				<div class="flex-1 md:flex-grow-0">
					<Button
						class="flex-row-center space-x-1.5 px-2 h-full"
						flat
						onClick={() => setIsListenersModalOpen(true)}
					>
						<Icon name="people" size="lg" class="text-neutral-400 mx-auto" />

						<Show when={queue.data.voiceChannel.members.length}>
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
						</Show>
					</Button>
				</div>

				<Divider vertical dark />
				<InfoItem
					title="Autoplay"
					horizontal
					description={() => (
						<Switch
							checked={queue.data.autoplay}
							disabled={queue.freezeState.queue || queue.data.empty}
							onChange={() => queue.toggleAutoplay()}
						/>
					)}
					extraClass="flex-1 md:flex-grow-0"
				/>
			</div>

			<MemberListModal isOpen={isListenersModalOpen()} handleClose={() => setIsListenersModalOpen(false)} />
		</>
	);
};
