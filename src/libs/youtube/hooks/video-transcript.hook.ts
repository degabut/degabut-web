import { useApi } from "@common/hooks";
import { ITranscript, YouTubeApi } from "@youtube/apis";
import { Accessor, createMemo, createResource } from "solid-js";

type IUseTranscriptProps = Accessor<string>;

export type FormattedTranscript = Omit<ITranscript, "text"> & {
	texts: string[];
};

export const useVideoTranscript = (videoId: IUseTranscriptProps) => {
	const api = useApi();
	const youtube = new YouTubeApi(api.youtubeClient);
	const [_data, { refetch, mutate }] = createResource(videoId, youtube.getVideoTranscript, { initialValue: null });

	const data = createMemo(() => {
		if (_data.loading) return [];

		const formatted: FormattedTranscript[] = [];

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
