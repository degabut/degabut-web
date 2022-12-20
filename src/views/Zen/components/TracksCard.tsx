import { QueueTrackList } from "@views/Queue/components/QueueTabs/QueueTrackList";
import { Component } from "solid-js";
import { Card } from "./Card";
import { SwitchViewButton } from "./SwitchViewButton";

type Props = {
	isShowTracks: boolean;
	onSwitchView: () => void;
};

export const TracksCard: Component<Props> = (props) => {
	return (
		<Card extraClass="hidden" extraClassList={{ "!block": props.isShowTracks }}>
			<div class="block md:hidden">
				<SwitchViewButton isShowTracks={props.isShowTracks} onClick={() => props.onSwitchView()} />
			</div>

			<QueueTrackList keyword="" />
		</Card>
	);
};
