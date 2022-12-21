import { Icon } from "@components/Icon";
import { Text } from "@components/Text";
import { useQueue } from "@hooks/useQueue";
import { secondsToTime } from "@utils/time";
import { Component } from "solid-js";

export const QueueInfo: Component = () => {
	const queue = useQueue();

	const queueDuration = () => {
		return secondsToTime(queue.data.tracks?.reduce((curr, { video }) => curr + video.duration, 0) || 0);
	};

	return (
		<div class="flex flex-row justify-end space-x-4 py-1 px-2">
			<div title="Queue Duration" class="flex-row-center space-x-1.5 text-neutral-400">
				<Icon name="clock" size="sm" class="fill-current" />
				<Text.Caption2>{queueDuration()}</Text.Caption2>
			</div>
			<div title="Track Count" class="flex-row-center space-x-1 text-neutral-400">
				<Icon name="musicNote" size="sm" class="fill-current" />
				<Text.Caption2>{queue.data.tracks?.length || 0}</Text.Caption2>
			</div>
		</div>
	);
};
