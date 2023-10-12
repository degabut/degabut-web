import { Divider, RouterLink, Text } from "@components/atoms";
import { useQueue } from "@hooks/useQueue";
import { secondsToTime } from "@utils/time";
import { Component, For, JSX } from "solid-js";

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

	const queueDuration = () => {
		return secondsToTime(queue.data.tracks?.reduce((curr, { video }) => curr + video.duration, 0) || 0);
	};

	return (
		<div class="flex flex-row space-x-3 md:space-x-4 py-4 truncate overflow-x-auto">
			<InfoItem title="Queue Duration" description={queueDuration()}></InfoItem>

			<Divider vertical />

			<InfoItem title="Track Count" description={queue.data.tracks?.length || 0}></InfoItem>

			<Divider vertical />

			<div class="flex-row-center -space-x-2">
				<For each={queue.data.voiceChannel?.members || []}>
					{(member) => (
						<RouterLink href={`/app/recommendation/${member.id}`}>
							<img
								title={member.displayName}
								class="rounded-full w-8 h-8 hover:z-50 relative border-neutral-900 border-2"
								src={member.avatar || "/img/avatar.png"}
							/>
						</RouterLink>
					)}
				</For>
			</div>
		</div>
	);
};
