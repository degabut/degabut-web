import { Text } from "@common/components";
import { IRecap } from "@user/apis";
import { Component, For } from "solid-js";

type Props = {
	recap: IRecap;
};

export const MonthlyActivitySection: Component<Props> = (props) => {
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

	const maxDurationPlayed = () => Math.max(...props.recap.monthly.map((item) => item.durationPlayed));

	return (
		<div class="space-y-4">
			<Text.H3 class="text-center">Song Listened per Month</Text.H3>
			<table>
				<For each={props.recap.monthly}>
					{({ month, durationPlayed, songPlayed }) => (
						<tr>
							<td>
								<Text.H3 class="text-right">{months[month]}</Text.H3>
							</td>
							<td class="w-full px-4 py-2">
								<div class="flex items-center">
									<div
										class="h-4 bg-brand-500"
										style={{ width: `${(durationPlayed / maxDurationPlayed()) * 100}%` }}
									/>
									<Text.H6 class="pl-1 flex-grow h-4 font-normal text-brand">{songPlayed}</Text.H6>
								</div>
							</td>
						</tr>
					)}
				</For>
			</table>
		</div>
	);
};
