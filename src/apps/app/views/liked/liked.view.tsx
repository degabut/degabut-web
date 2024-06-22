import { useApp } from "@app/providers";
import { Button, Container, Icon, ItemDetails, Text } from "@common";
import { MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useLiked } from "@user";
import { onMount, type Component } from "solid-js";

export const Liked: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;
	const liked = useLiked();

	onMount(() => app.setTitle("Liked Songs"));

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
						fill
						theme="brand"
						disabled={!canBeAdded()}
						rounded
						icon="plus"
						class="space-x-2 px-8 py-2"
					>
						<Text.Body1 class="font-medium">Add to Queue</Text.Body1>
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
