import { Button, Divider, Icon, Modal, RouterLink, Text } from "@components/atoms";
import { Item } from "@components/molecules";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "@solidjs/router";
import { secondsToTime } from "@utils/time";
import { Component, For, JSX, createSignal } from "solid-js";

type Props = {
	title: JSX.Element;
	description: JSX.Element;
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
	const navigate = useNavigate();

	const [isListenersModalOpen, setIsListenersModalOpen] = createSignal(false);

	const queueDuration = () => {
		return secondsToTime(queue.data.tracks?.reduce((curr, { video }) => curr + video.duration, 0) || 0);
	};

	return (
		<>
			<div class="flex flex-row space-x-3 md:space-x-4 py-4 truncate overflow-x-auto">
				<InfoItem title="Queue Duration" description={queueDuration()}></InfoItem>

				<Divider vertical />

				<InfoItem title="Track Count" description={queue.data.tracks?.length || 0}></InfoItem>

				<Divider vertical />

				<div class="flex-row-center space-x-1.5">
					<Button flat class="w-8 h-8" onClick={() => setIsListenersModalOpen(true)}>
						<Icon name="people" size="lg" class="fill-neutral-500 mx-auto" />
					</Button>

					<div class="flex-row-center overflow-x-clip -space-x-2">
						<For each={queue.data.voiceChannel?.members || []}>
							{(member) => (
								<RouterLink href={`/app/recommendation/${member.id}`}>
									<div class="rounded-full w-8 h-8 hover:z-50 border-neutral-900 border-2">
										<img
											title={member.displayName}
											class="rounded-full"
											src={member.avatar || "/img/avatar.png"}
										/>
									</div>
								</RouterLink>
							)}
						</For>
					</div>
				</div>
			</div>

			<Modal
				isOpen={isListenersModalOpen()}
				closeOnEscape
				onClickOutside={() => setIsListenersModalOpen(false)}
				extraContainerClass="bg-neutral-900 w-[32rem] top-[15vh] h-[90vh] md:h-[70vh]"
			>
				<div class="flex flex-col h-full">
					<div class="bg-neutral-900 pt-4 md:pt-8 px-2 md:px-8">
						<Text.H2 class="text-center mb-4">Listeners</Text.H2>
						<Divider extraClass="my-4" />
					</div>

					<div class="flex flex-col py-8 px-4 md:p-8 !pt-0 space-y-2 overflow-auto">
						<For each={queue.data.voiceChannel?.members || []}>
							{(member) => (
								<Item.List
									onClick={() => navigate(`/app/recommendation/${member.id}`)}
									title={member.displayName}
									extra={<Text.Caption1>{member.username}</Text.Caption1>}
									icon={member.avatar || "/img/avatar.png"}
									extraIconClass="rounded-full"
								/>
							)}
						</For>
					</div>
				</div>
			</Modal>
		</>
	);
};
