import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import { UserApi } from "../apis";

type PropsValue = {
	from: Date;
	to: Date;
};

type IUseMonthlyPlayActivityProps = Accessor<PropsValue> | PropsValue;

export const useMonthlyPlayActivity = (props: IUseMonthlyPlayActivityProps) => {
	const api = useApi();
	const user = new UserApi(api.client);

	const resource = createResource(props, (value) => user.getMonthlyPlayActivity(value), { initialValue: [] });

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
