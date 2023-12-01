import { Text } from "@common/components";
import { TimeUtil } from "@common/utils";
import { IRecap } from "@user/apis";
import { Component, For } from "solid-js";

type Props = {
	recap: IRecap;
};

export const MonthlyActivitySection: Component<Props> = (props) => {
	const maxDurationPlayed = () => Math.max(...props.recap.monthly.map((item) => item.durationPlayed));

	return (
		<div class="space-y-4 w-full max-w-xl">
			<Text.H3 class="text-center">Song Listened per Month</Text.H3>
			<table>
				<For each={props.recap.monthly}>
					{({ month, durationPlayed, songPlayed }) => (
						<tr>
							<td>
								<Text.H3 class="text-right">{TimeUtil.getMonths(month)}</Text.H3>
							</td>
							<td class="w-full px-4 py-1">
								<div class="flex items-center space-x-1">
									<div
										class="h-4 bg-brand-500"
										style={{ width: `${(durationPlayed / maxDurationPlayed()) * 100}%` }}
									/>
									<div class="h-full">
										<Text.Caption2 class="!text-brand">{songPlayed}</Text.Caption2>
									</div>
								</div>
							</td>
						</tr>
					)}
				</For>
			</table>
		</div>
	);
};
