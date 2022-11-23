import { Accessor, createResource } from "solid-js";
import { useApi } from "./useApi";

type IUsePlaylistProps = {
	playlistId: Accessor<string>;
};

export const usePlaylist = ({ playlistId }: IUsePlaylistProps) => {
	const api = useApi();
	const [videos, { refetch: refetchVideos }] = createResource(playlistId, api.playlist.getPlaylistVideos.bind(this));
	const [playlist, { refetch: refetchPlaylist }] = createResource(playlistId, api.playlist.getPlaylist);

	const update = async (name: string) => {
		await api.playlist.updatePlaylist(playlistId(), name);
	};

	const addVideo = async (videoId: string) => {
		await api.playlist.addPlaylistVideo(playlistId(), videoId);
		await refetchVideos();
	};

	const removeVideo = async (playlistVideoId: string) => {
		await api.playlist.removePlaylistVideo(playlistId(), playlistVideoId);
		await refetchVideos();
	};

	const totalDuration = () => videos()?.reduce((acc, pv) => acc + pv.video.duration, 0) || 0;

	const isLoading = () => videos.loading || playlist.loading;

	return { playlist, refetchPlaylist, videos, update, addVideo, removeVideo, isLoading, totalDuration };
};
