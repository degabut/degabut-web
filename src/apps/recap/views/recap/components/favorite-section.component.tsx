import { Text } from "@common/components";
import { IRecap } from "@user/apis";
import { Component } from "solid-js";

type Props = {
	recap: IRecap;
};

export const FavoriteSection: Component<Props> = (props) => {
	const favorite = () => {
		const { video, count } = props.recap.mostPlayed[0];
		const minutes = Math.floor((video.duration * count) / 60);
		const hours = Math.floor(minutes / 60);

		return {
			video,
			count,
			minutes,
			hours,
		};
	};

	return (
		<div class="flex-col-center space-y-6">
			<img src={favorite().video.thumbnails.at(-1)?.url} alt={favorite().video.title} class="w-96" />
			<div class="text-center">
				<Text.H2>{favorite().video.title}</Text.H2>
				<Text.Body2>{favorite().video.channel?.name}</Text.Body2>
			</div>
			<div class="flex-col-center text-center">
				<Text.Body1>
					You played it <b>{favorite().count}</b> times
				</Text.Body1>
				<Text.Body1>
					That's over <b>{Math.floor(favorite().minutes)}</b> minutes (<b>{favorite().hours}</b> hours)!
				</Text.Body1>
			</div>
		</div>
	);
};
