import { useApi } from "@common";
import { createResource } from "solid-js";
import { IQueueSummary, QueueApi } from "../apis";

export const useJoinableQueue = () => {
	const api = useApi();
	const queueApi = new QueueApi(api.client);
	const [data, { refetch }] = createResource(queueApi.getJoinable, { initialValue: [] as IQueueSummary[] });
	return { data, refetch };
};
