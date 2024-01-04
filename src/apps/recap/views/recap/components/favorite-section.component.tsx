import { Text } from "@common/components";
import { IRecap } from "@user/apis";
import { Component, Show } from "solid-js";

type Props = {
	recap: IRecap;
};

export const FavoriteSection: Component<Props> = (props) => {
	const favorite = () => {
		const mostPlayed = props.recap.mostPlayed.at(0);
		if (!mostPlayed) return null;

		const { mediaSource, count } = mostPlayed;
		const minutes = Math.floor((mediaSource.duration * count) / 60);
		const hours = Math.floor(minutes / 60);

		return {
			mediaSource,
			count,
			minutes,
			hours,
		};
	};

	return (
		<div class="flex-col-center space-y-6">
			<Show when={favorite()} keyed>
				{({ mediaSource, count, minutes, hours }) => (
					<>
						<img src={mediaSource.maxThumbnailUrl} alt={mediaSource.title} class="w-96" />
						<div class="text-center">
							<Text.H2>{mediaSource.title}</Text.H2>
							<Text.Body2>{mediaSource.creator}</Text.Body2>
						</div>
						<div class="flex-col-center text-center">
							<Text.Body1>
								You played it <b>{count}</b> times
							</Text.Body1>
							<Text.Body1>
								That's over <b>{Math.floor(minutes)}</b> minutes (<b>{hours}</b> hours)!
							</Text.Body1>
						</div>
					</>
				)}
			</Show>
		</div>
	);
};
