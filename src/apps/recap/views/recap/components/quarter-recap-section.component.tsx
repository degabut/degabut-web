import { Tabs, Text } from "@common/components";
import { TimeUtil } from "@common/utils";
import { IMonthly, IRecap } from "@user/apis";
import { Component, Show } from "solid-js";

const TabContent: Component<{ month: IMonthly }> = (props) => {
	return (
		<div class="flex flex-col space-y-8 w-full">
			<div class="flex justify-evenly text-center">
				<Text.H2 class="font-normal">
					<b>{props.month.songPlayed}</b> song played
				</Text.H2>
				<Text.H2 class="font-normal">
					Listened for <b>{Math.floor(props.month.durationPlayed / 60)} mins</b>
				</Text.H2>
			</div>

			<Show when={props.month.mostPlayed} keyed>
				{({ video }) => (
					<div class="flex-col-center space-y-3">
						<Text.H2>Top Song</Text.H2>
						<img
							src={video.thumbnails.at(0)?.url}
							alt={video.title}
							class="w-24 aspect-square object-cover"
						/>
						<div class="text-center w-full truncate">
							<Text.H3 class="truncate">{video.title}</Text.H3>
							<Text.Body2>{video.channel?.name}</Text.Body2>
						</div>
					</div>
				)}
			</Show>
		</div>
	);
};

type Props = {
	quarter: 1 | 2 | 3 | 4;
	recap: IRecap;
};

export const QuarterRecapSection: Component<Props> = (props) => {
	const quarterData = () => {
		return props.recap.monthly.slice(props.quarter * 3 - 3, props.quarter * 3);
	};

	return (
		<div class="w-full max-w-xl">
			<Show when={quarterData()} keyed>
				{([first, second, third]) => (
					<Tabs
						extraContentContainerClass="pt-8"
						extraTabClass="flex-1"
						items={[
							{
								id: "1",
								labelText: TimeUtil.getMonths(first.month),
								element: () => <TabContent month={first} />,
							},
							{
								id: "2",
								labelText: TimeUtil.getMonths(second.month),
								element: () => <TabContent month={second} />,
							},
							{
								id: "3",
								labelText: TimeUtil.getMonths(third.month),
								element: () => <TabContent month={third} />,
							},
						]}
					/>
				)}
			</Show>
		</div>
	);
};
