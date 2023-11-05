import { Text } from "@common/components";
import { IVideo, IVideoCompact } from "@youtube/apis";
import { Video } from "@youtube/components";

export class UserConfirmationUtil {
	static removePlayHistoryConfirmation(video: IVideo | IVideoCompact) {
		return {
			title: "Remove Play History",
			message: (
				<div class="flex-col-center space-y-6">
					<Video.List video={video} />
					<Text.Body2 class="text-center">
						This action will remove the video from your most played and recently played lists until you play
						it again.
					</Text.Body2>
				</div>
			),
		};
	}
}
