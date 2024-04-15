import { Text } from "@common";
import { MediaSource ,type  IMediaSource  } from "@media-source";

export class UserConfirmationUtil {
	static removePlayHistoryConfirmation(mediaSource: IMediaSource) {
		return {
			title: "Remove Play History",
			message: () => (
				<div class="flex-col-center space-y-6">
					<MediaSource.List mediaSource={mediaSource} />
					<Text.Body2 class="text-center">
						This action will remove the track from your most played and recently played lists until you play
						it again.
					</Text.Body2>
				</div>
			),
		};
	}
}
