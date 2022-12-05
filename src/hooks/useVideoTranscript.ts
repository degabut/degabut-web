import { ITranscript } from "@api";
import { Accessor, createMemo, createResource } from "solid-js";
import { useApi } from "./useApi";

type IUseTranscriptProps = Accessor<string>;

export type FormattedTranscript = Omit<ITranscript, "text"> & {
	texts: string[];
};

export const useVideoTranscript = (videoId: IUseTranscriptProps) => {
	const api = useApi();
	const [_data, { refetch, mutate }] = createResource(videoId, api.youtube.getVideoTranscript);

	const data = createMemo(() => {
		if (_data.loading) return [];

		const formatted: FormattedTranscript[] = [];

		for (const transcript of _data() || []) {
			if (transcript.start === transcript.end) continue;
			let text = transcript.text.replaceAll("♪", "");
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
