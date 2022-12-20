import { QueueTrackList } from "@views/Queue/components/QueueTabs/QueueTrackList";
import { Component } from "solid-js";
import { Card } from "./Card";

export const TracksCard: Component = () => {
	return (
		<Card>
			<div class="h-full overflow-y-auto">
				<QueueTrackList keyword="" />
			</div>
		</Card>
	);
};
