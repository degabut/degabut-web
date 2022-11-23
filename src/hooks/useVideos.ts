import { Accessor, createResource } from "solid-js";
import { useApi } from "./useApi";

type BaseProps = {
	guild?: boolean;
	voiceChannel?: boolean;
};

type PropsValue =
	| null
	| string
	| ({
			userId: string;
			last: number;
	  } & BaseProps)
	| ({
			userId: string;
			days: number;
			count: number;
	  } & BaseProps);

type IUseVideosProps = Accessor<PropsValue> | PropsValue;

export const useVideos = (props: IUseVideosProps) => {
	const api = useApi();
	const resource = createResource(props, (value) => {
		if (typeof value === "string") {
			return api.youtube.searchVideos(value);
		} else if ("userId" in value) {
			if (value.userId !== "me" && ("guild" in value || "voiceChannel" in value)) {
				return [];
			}

			const { guild, voiceChannel } = value;
			const baseProps = { guild, voiceChannel };
			if ("last" in value) {
				return api.user.getVideoHistory(value.userId, { last: value.last, ...baseProps });
			} else {
				return api.user.getVideoHistory(value.userId, { count: value.count, days: value.days, ...baseProps });
			}
		}
	});

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
