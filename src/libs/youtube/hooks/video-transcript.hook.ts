import { useApi, type TimedText } from "@common";
import { createMemo, createResource, type Accessor } from "solid-js";
import { YouTubeApi } from "../apis";

type IUseTranscriptProps = Accessor<string>;

export const useVideoTranscript = (videoId: IUseTranscriptProps) => {
	const api = useApi();
	const youtube = new YouTubeApi(api.youtubeClient);
	const [_data, { refetch, mutate }] = createResource(videoId, youtube.getVideoTranscript, { initialValue: null });

	const data = createMemo(() => {
		if (_data.loading) return [];

		const formatted: TimedText[] = [];

		for (const transcript of _data() || []) {
			if (transcript.start === transcript.end || !transcript.text) continue;
			let text = transcript.text?.replaceAll("♪", "");
			if (!text.trim()) text = transcript.text;

			const index = formatted.findIndex((t) => t.start === transcript.start && t.end === transcript.end);
			if (index === -1) {
				formatted.push({
					...transcript,
					texts: [text],
				});
			} else if (!formatted[index].texts.includes(text)) {
				formatted[index].texts.push(text);
			}
		}

		return formatted.sort((a, b) => a.start - b.start);
	});

	const isLoading = () => _data.loading;

	return {
		data,
		isLoading,
		mutate,
		refetch,
	};
};
