import { Item, Text } from "@common/components";
import { useScreen } from "@common/hooks";
import { TimeUtil } from "@common/utils";
import { IRecap } from "@user/apis";
import { Component, For } from "solid-js";

type OverviewDataProps = {
	label: string;
	value: string | number;
};

const OverviewData: Component<OverviewDataProps> = (props) => (
	<div class="text-center">
		<Text.H1 class="text-brand">{props.label}</Text.H1>
		<Text.H2 class="font-light truncate">{props.value}</Text.H2>
	</div>
);

type OverviewSectionProps = {
	recap: IRecap;
	year: number;
};

export const OverviewSection: Component<OverviewSectionProps> = (props) => {
	const screen = useScreen();
	const scale = () => {
		const width = screen.size;
		if (width >= 1024) return 1;
		return width / (1024 + 16);
	};

	const peakMonth = () =>
		props.recap.monthly.find(
			(month) => month.songPlayed === Math.max(...props.recap.monthly.map((data) => data.songPlayed))
		);

	return (
		<div
			class="w-[1024px] border-gray-500 border py-8 px-12 rounded-lg relative overflow-hidden space-y-6"
			style={{ transform: `scale(${scale()})` }}
		>
			<Text.H1 class="text-center text-brand text-3xl">
				Degabut<span class="text-gray-100"> {props.year} </span>Recap
			</Text.H1>

			<div class="flex flex-row w-full">
				<div class="flex flex-col w-full truncate">
					<Text.H1 class="mb-2 text-brand">Top Songs</Text.H1>
					<For each={props.recap.mostPlayed}>
						{({ video, count }, i) => (
							<div class="flex-row-center space-x-2 w-full truncate">
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

				<div class="flex flex-col w-2/3 justify-around">
					<OverviewData label="Song Played" value={props.recap.songPlayed} />
					<OverviewData label="Listened for" value={`${Math.floor(props.recap.durationPlayed / 60)} mins`} />
					<OverviewData label="Peak Month" value={TimeUtil.getMonths(peakMonth()!.month)} />
				</div>
			</div>

			<img
				class="rounded-full opacity-10 absolute -right-12 -bottom-12"
				src="/icons/windows11/LargeTile.scale-100.png"
				alt=""
			/>
		</div>
	);
};
