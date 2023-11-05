import { useApi } from "@common/hooks";
import { Accessor, createResource } from "solid-js";
import { PlaylistApi } from "../apis";

type IUsePlaylistProps = {
	playlistId: Accessor<string>;
};

export const usePlaylist = ({ playlistId }: IUsePlaylistProps) => {
	const api = useApi();
	const playlistApi = new PlaylistApi(api.client);

	const [videos, { mutate: mutateVideos }] = createResource(playlistId, playlistApi.getPlaylistVideos);
	const [playlist, { refetch: refetchPlaylist, mutate: mutatePlaylist }] = createResource(
		playlistId,
		playlistApi.getPlaylist
	);

	const update = async (name: string) => {
		await playlistApi.updatePlaylist(playlistId(), name);
	};

	const removeVideo = async (playlistVideoId: string) => {
		await playlistApi.removePlaylistVideo(playlistId(), playlistVideoId);
		mutateVideos((videos) => videos?.filter((v) => v.id !== playlistVideoId));
		mutatePlaylist((playlist) => {
			if (playlist) playlist.videoCount -= 1;
			return playlist;
		});
	};

	const totalDuration = () => videos()?.reduce((acc, pv) => acc + pv.video.duration, 0) || 0;

	const isLoading = () => videos.loading || playlist.loading;

	return { playlist, refetchPlaylist, videos, update, removeVideo, isLoading, totalDuration };
};
