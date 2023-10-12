import { QueueTrackList } from "@views/Queue/components/QueueTabs/QueueTrackList";
import { Component } from "solid-js";
import { Card } from "./Card";

export const TracksCard: Component = () => {
	return (
		<Card>
			<QueueTrackList />
		</Card>
	);
};
