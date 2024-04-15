import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import { UserApi } from "../apis";

type PropsValue = { year: number };

type IUseRecapProps = Accessor<PropsValue> | PropsValue;

export const useRecap = (props: IUseRecapProps) => {
	const api = useApi();
	const user = new UserApi(api.client);

	const resource = createResource(props, ({ year }) => user.getRecap(year), { initialValue: null });

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
