import { useApi } from "@common/hooks";
import { Accessor, createResource } from "solid-js";
import { UserApi } from "../apis";

type BaseProps = {
	guild?: boolean;
	voiceChannel?: boolean;
};

type PropsValue =
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

export const usePlayHistory = (props: IUseVideosProps) => {
	const api = useApi();
	const user = new UserApi(api.client);

	const resource = createResource(props, (value) => {
		if (value.userId !== "me" && ("guild" in value || "voiceChannel" in value)) {
			return [];
		}

		const { guild, voiceChannel } = value;
		const baseProps = { guild, voiceChannel };

		const params =
			"last" in value
				? { last: value.last, ...baseProps }
				: { count: value.count, days: value.days, ...baseProps };

		return value.userId === "me" ? user.getPlayHistory(params) : user.getUserPlayHistory(value.userId, params);
	});

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
