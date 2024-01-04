import { useApi } from "@common/hooks";
import { Accessor, createResource } from "solid-js";
import { PlaylistApi } from "../apis";

type IUsePlaylistProps = {
	playlistId: Accessor<string>;
};

export const usePlaylist = ({ playlistId }: IUsePlaylistProps) => {
	const api = useApi();
	const playlistApi = new PlaylistApi(api.client);

	const [mediaSources, { mutate: mutateMediaSources }] = createResource(
		playlistId,
		playlistApi.getPlaylistMediaSources
	);
	const [playlist, { refetch: refetchPlaylist, mutate: mutatePlaylist }] = createResource(
		playlistId,
		playlistApi.getPlaylist
	);

	const update = async (name: string) => {
		await playlistApi.updatePlaylist(playlistId(), name);
	};

	const removeMediaSource = async (playlistMediaSourceId: string) => {
		await playlistApi.removePlaylistMediaSource(playlistId(), playlistMediaSourceId);
		mutateMediaSources((mediaSources) => mediaSources?.filter((m) => m.id !== playlistMediaSourceId));
		mutatePlaylist((playlist) => {
			if (playlist) playlist.mediaSourceCount -= 1;
			return playlist;
		});
	};

	const totalDuration = () => mediaSources()?.reduce((acc, pv) => acc + pv.mediaSource.duration, 0) || 0;

	const isLoading = () => mediaSources.loading || playlist.loading;

	return {
		playlist,
		refetchPlaylist,
		mediaSources,
		update,
		removeMediaSource,
		isLoading,
		totalDuration,
	};
};
