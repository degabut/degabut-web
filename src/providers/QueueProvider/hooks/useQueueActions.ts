import { ITrack, IVideoLike, LoopMode } from "@api";
import { useApi } from "@hooks/useApi";
import { AxiosError } from "axios";
import { SetStoreFunction } from "solid-js/store";
import { FreezeState, QueueResource } from "../QueueProvider";

type Params = {
	queue: QueueResource;
	setFreezeState: SetStoreFunction<FreezeState>;
};

export const useQueueActions = ({ queue, setFreezeState }: Params) => {
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
		if (queue.empty) return;
		setFreezeState({ seek: true });
		return api.player.seek(queue.voiceChannel.id, seek);
	};

	const playTrack = (track: ITrack) => {
		return modifyTrack(async (queueId) => {
			await api.queue.playTrack(queueId, track.id);
			if (queue.isPaused) await api.player.unpause(queueId);
		});
	};

	const removeTrack = (trackOrId: ITrack | string) => {
		return modifyTrack((queueId) =>
			api.queue.removeTrack(queueId, typeof trackOrId === "string" ? trackOrId : trackOrId.id)
		);
	};

	const addTrack = (video: IVideoLike) => {
		return modifyTrack((queueId) => api.queue.addTrackByVideoId(queueId, video.id));
	};

	const addTrackById = (videoId: string) => {
		return modifyTrack((queueId) => api.queue.addTrackByVideoId(queueId, videoId));
	};

	const addTrackByKeyword = (keyword: string) => {
		return modifyTrack((queueId) => api.queue.addTrackByKeyword(queueId, keyword));
	};

	const addAndPlayTrack = (video: IVideoLike) => {
		return modifyTrack(async (queueId) => {
			const trackId =
				queue.tracks?.find((t) => t.video.id === video.id)?.id ||
				(await api.queue.addTrackByVideoId(queueId, video.id));
			try {
				await api.queue.playTrack(queueId, trackId);
				if (queue.isPaused) await api.player.unpause(queueId);
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
		if (queue.empty) return;
		const queueId = queue.voiceChannel.id;
		if (!queueId) return;
		await api.queue.jam(queueId, count);
	};

	const modifyTrack = async (fn: (queueId: string) => Promise<unknown>) => {
		if (queue.empty) return;
		const queueId = queue.voiceChannel.id;
		if (!queueId) return;

		setFreezeState({ track: true });

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
			setFreezeState({ track: false });
		}
	};

	const modifyQueue = async (fn: (queueId: string) => Promise<unknown> | unknown) => {
		if (queue.empty) return;

		const queueId = queue.voiceChannel.id;

		setFreezeState({ queue: true });
		await fn(queueId);
		setFreezeState({ queue: false });
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
