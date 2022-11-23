import { Accessor, createResource } from "solid-js";
import { useApi } from "./useApi";

type PropsValue = string;

type IUseYouTubePlaylistsProps = Accessor<PropsValue> | PropsValue;

export const useYouTubePlaylists = (props: IUseYouTubePlaylistsProps) => {
	const api = useApi();
	const resource = createResource(props, api.youtube.searchPlaylists);

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
