import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import { UserApi, type GetLastPlayedParams, type GetMostPlayedParams } from "../apis";

type PropsValue = ((GetMostPlayedParams | GetLastPlayedParams) & { userId?: string }) | undefined;

type IUsePlayHistoryProps = Accessor<PropsValue> | PropsValue;

export const usePlayHistory = (props: IUsePlayHistoryProps) => {
	const api = useApi();
	const user = new UserApi(api.client);

	const resource = createResource(
		props,
		(value) => {
			if (!value.userId || value.userId === "me") {
				if ("from" in value) return user.getMostPlayed(value);
				else return user.getPlayHistory(value);
			} else if (value.userId) {
				return user.getUserPlayHistory(value.userId, value);
			}
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
