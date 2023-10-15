import { QueueTrackList } from "@views/Queue/components/QueueTabs/components";
import { Component } from "solid-js";
import { Card } from "./Card";
import { SwitchViewButton } from "./SwitchViewButton";

type Props = {
	isShowTracks: boolean;
	onSwitchView: () => void;
};

export const TracksCard: Component<Props> = (props) => {
	return (
		<Card extraClass="hidden" extraClassList={{ "!block ": props.isShowTracks }}>
			<div class="flex flex-col h-full space-y-4 md:space-y-0">
				<div class="block md:hidden">
					<SwitchViewButton isShowTracks={props.isShowTracks} onClick={() => props.onSwitchView()} />
				</div>

				<div class="grow overflow-y-auto">
					<QueueTrackList />
				</div>
			</div>
		</Card>
	);
};
