import { Text } from "@components/Text";
import { Videos } from "@components/Videos";
import { useQueue } from "@hooks/useQueue";
import { useRecommendation } from "@hooks/useRecommendation";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component } from "solid-js";
import { Card } from "./components/Card";

export const DesktopOverlayRecommendation: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();
	const recommendation = useRecommendation({ userId: () => "me" });

	return (
		<div class="grid grid-cols-2 gap-2 lg:gap-4 2xl:gap-8 h-full">
			<Card>
				<div class="flex flex-col space-y-3 h-full">
					<Text.H3 class="text-center">Most Played</Text.H3>
					<div class="grow overflow-y-auto">
						<Videos.List
							isLoading={recommendation.mostPlayed().loading}
							showWhenLoading
							data={recommendation.mostPlayed().data}
							videoProps={(video) => ({
								video,
								inQueue: queue.data.tracks?.some((t) => t.video.id === video.id),
								contextMenu: getVideoContextMenu({
									appStore: app,
									queueStore: queue,
									navigate,
									video,
								}),
							})}
						/>
					</div>
				</div>
			</Card>

			<Card>
				<div class="flex flex-col space-y-3 h-full">
					<Text.H3 class="text-center">Recently Played</Text.H3>
					<div class="grow overflow-y-auto">
						<Videos.List
							isLoading={recommendation.lastPlayed().loading}
							showWhenLoading
							data={recommendation.lastPlayed().data}
							videoProps={(video) => ({
								video,
								inQueue: queue.data.tracks?.some((t) => t.video.id === video.id),
								contextMenu: getVideoContextMenu({
									appStore: app,
									queueStore: queue,
									navigate,
									video,
								}),
							})}
						/>
					</div>
				</div>
			</Card>
		</div>
	);
};
