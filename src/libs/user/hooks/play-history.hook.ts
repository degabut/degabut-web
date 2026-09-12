import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import {
	UserApi,
	type GetLastPlayedParams,
	type GetMostPlayedDeprecatedParams,
	type GetMostPlayedParams,
} from "../apis";

type PlayHistoryParams = GetLastPlayedParams | GetMostPlayedDeprecatedParams;
type PropsValue = (PlayHistoryParams & { userId?: string }) | GetMostPlayedParams | undefined;

type IUsePlayHistoryProps = Accessor<PropsValue> | PropsValue;

export const usePlayHistory = (props: IUsePlayHistoryProps) => {
	const api = useApi();
	const user = new UserApi(api.client);

	const resource = createResource(
		props,
		(value) => {
			if (!value) return [];

			if ("from" in value) return user.getMostPlayed(value);

			if (value.userId && value.userId !== "me") {
				return user.getUserPlayHistory(value.userId, value);
			}

			return user.getPlayHistory(value);
		},
		{ initialValue: [] }
	);

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
