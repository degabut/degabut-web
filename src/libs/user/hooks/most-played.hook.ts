import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import { UserApi } from "../apis";

type PropsValue = {
	from: Date;
	to: Date;
	limit: number;
	excludeFrom?: Date;
	excludeTo?: Date;
	excludeTopPercent?: number;
	guild?: boolean;
	voiceChannel?: boolean;
};

type IUseMostPlayedProps = Accessor<PropsValue> | PropsValue;

export const useMostPlayed = (props: IUseMostPlayedProps) => {
	const api = useApi();
	const user = new UserApi(api.client);

	const resource = createResource(props, (value) => user.getMostPlayed(value), { initialValue: [] });

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
