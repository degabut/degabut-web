import { Item, Text } from "@common/components";
import { IRecap } from "@user/apis";
import { Component, For } from "solid-js";

type OverviewDataProps = {
	label: string;
	values: string[] | number[];
};

const OverviewData: Component<OverviewDataProps> = (props) => (
	<div class="text-center">
		<Text.H1 class="text-brand">{props.label}</Text.H1>
		<For each={props.values}>{(value) => <Text.H2 class="font-light truncate">{value}</Text.H2>}</For>
	</div>
);

type OverviewSectionProps = {
	recap: IRecap;
	year: number;
};

export const OverviewSection: Component<OverviewSectionProps> = (props) => {
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
	const peakMonth = () =>
		props.recap.monthly.find(
			(month) => month.songPlayed === Math.max(...props.recap.monthly.map((data) => data.songPlayed))
		);

	return (
		<div id="overview-card" class="w-[1024px] border-gray-500 border p-5 rounded-lg relative overflow-hidden">
			<Text.H1 class="text-center text-brand text-3xl pb-5">
				Degabut<span class="text-gray-100"> {props.year} </span>Recap
			</Text.H1>
			<div class="w-full grid grid-cols-3 gap-x-4">
				<div class="flex flex-col col-span-2 w-full">
					<Text.H1 class="mb-2 text-brand">Top Songs</Text.H1>
					<For each={props.recap.mostPlayed}>
						{({ video, count }, i) => (
							<div class="flex-row-center md:space-x-4 w-full truncate">
								<div class="w-4">
									<Text.H2>{i() + 1}</Text.H2>
								</div>
								<div class="truncate w-full">
									<Item.List
										imageUrl={video.thumbnails.at(0)?.url}
										title={video.title}
										extra={() => (
											<Text.Caption1>
												Played {count} times - {video.channel?.name}
											</Text.Caption1>
										)}
									/>
								</div>
							</div>
						)}
					</For>
				</div>

				<div class="flex flex-col justify-around">
					<OverviewData label="Monthly Peak" values={[months[peakMonth()!.month]]} />
					<OverviewData label="Song Played" values={[props.recap.songPlayed]} />
					<OverviewData
						label="Listened for"
						values={[`${Math.floor(props.recap.durationPlayed / 60)} mins`]}
					/>
				</div>
				<img
					class="rounded-full opacity-10 absolute -right-11 -bottom-11"
					src="/icons/windows11/LargeTile.scale-100.png"
					alt=""
				/>
			</div>
		</div>
	);
};
