import { Container, Divider, Icon, Text, useInfiniteScrolling } from "@common";
import { MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useLiked } from "@user";
import { type Component } from "solid-js";

export const Liked: Component = () => {
	let containerElement!: HTMLDivElement;
	const queue = useQueue();
	const liked = useLiked({ onLoad: () => infinite.load() });

	const infinite = useInfiniteScrolling({
		callback: liked.next,
		container: () => containerElement,
		disabled: () => !liked.isFetchable(),
	});

	return (
		<Container size="md" ref={containerElement}>
			<div class="flex-row-center space-x-4">
				<div class="w-24 h-24 flex-col-center justify-center border border-neutral-600 rounded">
					<Icon name="heartLine" size="2xl" class="text-neutral-500" />
				</div>

				<div class="space-y-4 flex-grow truncate">
					<div class="flex-row-center justify-between md:justify-start md:space-x-8">
						<Text.H1 truncate>Liked Songs</Text.H1>
					</div>
				</div>
			</div>

			<Divider extraClass="my-8" />

			{/* TODO: add to queue buttons */}

			<MediaSources.List
				data={liked.data}
				isLoading={liked.isLoading()}
				showWhenLoading
				mediaSourceProps={({ mediaSource }) => ({
					mediaSource,
					inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id),
				})}
			/>
		</Container>
	);
};
