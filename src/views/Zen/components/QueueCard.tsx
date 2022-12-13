import { QueueTrackList } from "@views/Queue/components/QueueTabs/QueueTrackList";
import { Component } from "solid-js";
import { Card } from "./Card";
import { SwitchViewButton } from "./SwitchViewButton";

type Props = {
	isShowPlayer: boolean;
	onSwitchView: () => void;
};

export const QueueCard: Component<Props> = (props) => {
	return (
		<Card extraClass="hidden 2xl:block" extraClassList={{ "!block": !props.isShowPlayer }}>
			<div class="flex flex-col space-y-4 h-full">
				<SwitchViewButton isShowPlayer={props.isShowPlayer} onClick={() => props.onSwitchView()} />

				<div class="grow overflow-y-auto">
					<QueueTrackList keyword="" />
				</div>
			</div>
		</Card>
	);
};
