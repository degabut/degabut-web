import { IQueue, ITrack, IVideoCompact, LoopMode } from "@api";
import { useApi } from "@hooks/useApi";
import { AxiosError } from "axios";
import { Resource, Setter } from "solid-js";

type Params = {
	queue: Resource<IQueue | null | undefined>;
	setIsTrackFreezed: Setter<boolean>;
	setIsQueueFreezed: Setter<boolean>;
};

export const useQueueActions = ({ queue, setIsQueueFreezed, setIsTrackFreezed }: Params) => {
	const api = useApi();

	const toggleShuffle = () => {
		return modifyQueue((queueId) => api.queue.toggleShuffle(queueId));
	};

	const changeLoopMode = (loopMode: LoopMode) => {
		return modifyQueue((queueId) => api.queue.changeLoopMode(queueId, loopMode));
	};

	const pause = () => {
		return modifyQueue((queueId) => api.player.pause(queueId));
	};

	const unpause = () => {
		return modifyQueue((queueId) => api.player.unpause(queueId));
	};

	const changeTrackOrder = (trackId: string, toIndex: number) => {
		return modifyTrack((queueId) => api.queue.orderTrack(queueId, trackId, toIndex));
	};

	const skipTrack = () => {
		return modifyTrack((queueId) => api.player.skipTrack(queueId));
	};

	const seek = (seek: number) => {
		return modifyTrack((queueId) => api.player.seek(queueId, seek));
	};

	const playTrack = (track: ITrack) => {
		return modifyTrack((queueId) => api.queue.playTrack(queueId, track.id));
	};

	const removeTrack = (track: ITrack) => {
		return modifyTrack((queueId) => api.queue.removeTrack(queueId, track.id));
	};

	const addTrack = (video: IVideoCompact) => {
		return modifyTrack((queueId) => api.queue.addTrackByVideoId(queueId, video.id));
	};

	const addTrackById = (videoId: string) => {
		return modifyTrack((queueId) => api.queue.addTrackByVideoId(queueId, videoId));
	};

	const addTrackByKeyword = (keyword: string) => {
		return modifyTrack((queueId) => api.queue.addTrackByKeyword(queueId, keyword));
	};

	const addAndPlayTrack = (video: IVideoCompact) => {
		return modifyTrack(async (queueId) => {
			const trackId = await api.queue.addTrackByVideoId(queueId, video.id);
			try {
				await api.queue.playTrack(queueId, trackId);
			} catch {
				// ignore error
			}
		});
	};

	const addPlaylist = (playlistId: string) => {
		return modifyTrack((queueId) => api.queue.addPlaylist(queueId, playlistId));
	};

	const addYouTubePlaylist = (youtubePlaylistId: string) => {
		return modifyTrack((queueId) => api.queue.addYouTubePlaylist(queueId, youtubePlaylistId));
	};

	const clear = () => {
		return modifyTrack((queueId) => api.queue.clearQueue(queueId));
	};

	const jam = async (count: number) => {
		const queueId = queue()?.voiceChannel.id;
		if (!queueId) return;
		await api.queue.jam(queueId, count);
	};

	const modifyTrack = async (fn: (queueId: string) => Promise<unknown>) => {
		const queueId = queue()?.voiceChannel.id;
		if (!queueId) return;

		setIsTrackFreezed(true);

		try {
			await fn(queueId);
		} catch (err) {
			// TODO handle error properly
			if (err instanceof AxiosError) {
				alert(err.response?.data.message);
			} else {
				alert(err);
			}
		} finally {
			setIsTrackFreezed(false);
		}
	};

	const modifyQueue = async (fn: (queueId: string) => Promise<unknown> | unknown) => {
		const queueId = queue()?.voiceChannel.id;
		if (!queueId) return;

		setIsQueueFreezed(true);
		await fn(queueId);
		setIsQueueFreezed(false);
	};

	return {
		toggleShuffle,
		changeLoopMode,
		changeTrackOrder,
		skipTrack,
		playTrack,
		removeTrack,
		addTrack,
		addTrackById,
		addTrackByKeyword,
		addAndPlayTrack,
		addPlaylist,
		addYouTubePlaylist,
		seek,
		clear,
		pause,
		unpause,
		jam,
	};
};
