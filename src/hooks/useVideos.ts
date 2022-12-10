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

			const params =
				"last" in value
					? { last: value.last, ...baseProps }
					: { count: value.count, days: value.days, ...baseProps };

			return value.userId === "me"
				? api.me.getPlayHistory(params)
				: api.user.getPlayHistory(value.userId, params);
		}
	});

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
