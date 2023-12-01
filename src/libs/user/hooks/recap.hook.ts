import { useApi } from "@common/hooks";
import { Accessor, createResource } from "solid-js";
import { UserApi } from "../apis";

type PropsValue = { year: number };

type IUseRecapProps = Accessor<PropsValue> | PropsValue;

export const useRecap = (props: IUseRecapProps) => {
	const api = useApi();
	const user = new UserApi(api.client);

	const resource = createResource(props, ({ year }) => user.getRecap(year));

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
