import { ITranscript } from "@api";
import axios from "axios";
import { Accessor, createMemo, createResource } from "solid-js";
import { useApi } from "./useApi";

type IUseTranscriptProps = Accessor<string>;

type FormattedTranscript = Omit<ITranscript, "text"> & {
	texts: string[];
};

// TODO
const getDelay = async () => {
	const start = Date.now();
	const time = await axios.get("https://worldtimeapi.org/api/ip");
	const end = Date.now();
	const current = new Date(time.data.datetime).getTime() - (end - start) / 2;
	const difference = end - current;
	if (difference > 0) return difference;
	else return difference;
};

export const useVideoTranscript = (videoId: IUseTranscriptProps) => {
	const api = useApi();
	const [_data, { refetch, mutate }] = createResource(videoId, api.youtube.getVideoTranscript);
	const [delay] = createResource(getDelay);

	const data = createMemo(() => {
		if (_data.loading || !delay()) return [];

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

		return formatted;
	});

	const getFixedTime = () => Date.now() - (delay() || 0);

	return {
		data,
		getFixedTime,
		mutate,
		refetch,
	};
};
