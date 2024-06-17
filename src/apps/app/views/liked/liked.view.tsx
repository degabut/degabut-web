import { Button, Container, Icon, ItemDetails, Text } from "@common";
import { MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useLiked } from "@user";
import { type Component } from "solid-js";

export const Liked: Component = () => {
	const queue = useQueue();
	const liked = useLiked();

	const canBeAdded = () => {
		return !queue.data.empty && !liked.isLoading() && !!liked.data.length;
	};

	return (
		<Container size="md">
			<ItemDetails
				title="Liked Songs"
				image={() => (
					<div class="w-24 md:w-32 aspect-square flex-col-center justify-center border border-neutral-600 rounded">
						<Icon name="heartLine" size="3xl" class="text-neutral-500" />
					</div>
				)}
				actions={() => (
					<Button
						onClick={() => queue.addLastLiked()}
						disabled={queue.data.empty}
						rounded
						icon="plus"
						class=" text-neutral-850 space-x-2 px-4 py-1.5"
						classList={{
							"!bg-brand-800 !border-brand-800": !canBeAdded(),
							"bg-brand-600 hover:!bg-brand-500 !border-brand-600": canBeAdded(),
						}}
					>
						<Text.Body1>Add to Queue</Text.Body1>
					</Button>
				)}
				isInfiniteDisabled={!liked.isFetchable()}
				infiniteCallback={liked.next}
			>
				<MediaSources.List
					data={liked.data}
					isLoading={liked.isLoading()}
					showWhenLoading
					mediaSourceProps={({ mediaSource }) => ({
						mediaSource,
						inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id),
					})}
				/>
			</ItemDetails>
		</Container>
	);
};
