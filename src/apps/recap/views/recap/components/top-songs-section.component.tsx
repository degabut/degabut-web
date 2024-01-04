import { Item, Text } from "@common/components";
import { IRecap } from "@user/apis";
import { Component, For } from "solid-js";

type Props = {
	recap: IRecap;
};

export const TopSongsSection: Component<Props> = (props) => {
	return (
		<div class="flex-col-center space-y-3 w-full max-w-xl">
			<For each={props.recap.mostPlayed}>
				{({ mediaSource, count }, i) => (
					<div class="flex-row-center md:space-x-4 w-full truncate">
						<div class="w-4">
							<Text.H2>{i() + 1}</Text.H2>
						</div>
						<div class="truncate w-full">
							<Item.List
								imageUrl={mediaSource.minThumbnailUrl}
								title={mediaSource.title}
								extra={() => (
									<Text.Caption1>
										Played {count} times - {mediaSource.creator}
									</Text.Caption1>
								)}
							/>
						</div>
					</div>
				)}
			</For>
		</div>
	);
};
