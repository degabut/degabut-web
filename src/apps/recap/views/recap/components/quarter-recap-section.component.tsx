import { Item, Text } from "@common/components";
import { IRecap } from "@user/apis";
import { Component, For, Show } from "solid-js";

type Props = {
	quarter: 1 | 2 | 3 | 4;
	recap: IRecap;
};

export const QuarterRecapSection: Component<Props> = (props) => {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const quarterData = () => {
		return props.recap.monthly.slice(props.quarter * 3 - 3, props.quarter * 3);
	};

	return (
		<For each={quarterData()}>
			{({ month, durationPlayed, songPlayed, mostPlayed }, i) => (
				<>
					<div class="flex-col-center space-y-4">
						<Text.H2>{months[month]}</Text.H2>

						<div class="space-y-1">
							<div class="flex flex-row justify-center space-x-6 w-full">
								<Text.Body1>
									<b>{songPlayed}</b> song played
								</Text.Body1>
								<Text.Body1>
									Listened for <b>{Math.floor(durationPlayed / 60)} mins</b>
								</Text.Body1>
							</div>

							<Show when={mostPlayed} keyed>
								{({ video, count }) => (
									<div class="w-full truncate ">
										<Item.List
											extraContainerClass="w-min mx-auto"
											imageUrl={video.thumbnails.at(0)?.url}
											title={video.title}
											extra={() => (
												<Text.Caption1>
													Played {count} times - {video.channel?.name}
												</Text.Caption1>
											)}
										/>
									</div>
								)}
							</Show>
						</div>
					</div>

					<Show when={i() !== 2}>
						<div class="border-b border-neutral-700 my-4" />
					</Show>
				</>
			)}
		</For>
	);
};
