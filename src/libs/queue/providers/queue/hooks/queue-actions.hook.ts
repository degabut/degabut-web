import { useApi } from "@common/hooks";
import { ITrack, LoopMode, PlayerApi, QueueApi } from "@queue/apis";
import { IVideoLike } from "@youtube/apis";
import { AxiosError } from "axios";
import { SetStoreFunction } from "solid-js/store";
import { FreezeState, QueueResource } from "../";

type Params = {
	queue: QueueResource;
	setFreezeState: SetStoreFunction<FreezeState>;
};

export const useQueueActions = ({ queue, setFreezeState }: Params) => {
	const api = useApi();
	const queueApi = new QueueApi(api.client);
	const playerApi = new PlayerApi(api.client);

	const toggleShuffle = () => {
		return modifyQueue((queueId) => queueApi.toggleShuffle(queueId));
	};

	const changeLoopMode = (loopMode: LoopMode) => {
		return modifyQueue((queueId) => queueApi.changeLoopMode(queueId, loopMode));
	};

	const pause = () => {
		return modifyQueue((queueId) => playerApi.pause(queueId));
	};

	const unpause = () => {
		return modifyQueue((queueId) => playerApi.unpause(queueId));
	};

	const changeTrackOrder = (trackId: string, toIndex: number) => {
		return modifyTrack((queueId) => queueApi.orderTrack(queueId, trackId, toIndex));
	};

	const skipTrack = () => {
		return modifyTrack((queueId) => playerApi.skipTrack(queueId));
	};

	const seek = (seek: number) => {
		if (queue.empty) return;
		setFreezeState({ seek: true });
		return playerApi.seek(queue.voiceChannel.id, seek);
	};

	const playTrack = (track: ITrack) => {
		return modifyTrack(async (queueId) => {
			await queueApi.playTrack(queueId, track.id);
			if (queue.isPaused) await playerApi.unpause(queueId);
		});
	};

	const removeTrack = (trackOrId: ITrack | string) => {
		return modifyTrack((queueId) =>
			queueApi.removeTrack(queueId, typeof trackOrId === "string" ? trackOrId : trackOrId.id)
		);
	};

	const addTrack = (video: IVideoLike) => {
		return modifyTrack((queueId) => queueApi.addTrackByVideoId(queueId, video.id));
	};

	const addTrackById = (videoId: string) => {
		return modifyTrack((queueId) => queueApi.addTrackByVideoId(queueId, videoId));
	};

	const addTrackByKeyword = (keyword: string) => {
		return modifyTrack((queueId) => queueApi.addTrackByKeyword(queueId, keyword));
	};

	const addAndPlayTrack = (video: IVideoLike) => {
		return modifyTrack(async (queueId) => {
			const trackId =
				queue.tracks?.find((t) => t.video.id === video.id)?.id ||
				(await queueApi.addTrackByVideoId(queueId, video.id));
			try {
				await queueApi.playTrack(queueId, trackId);
				if (queue.isPaused) await playerApi.unpause(queueId);
			} catch {
				// ignore error
			}
		});
	};

	const addPlaylist = (playlistId: string) => {
		return modifyTrack((queueId) => queueApi.addPlaylist(queueId, playlistId));
	};

	const addYouTubePlaylist = (youtubePlaylistId: string) => {
		return modifyTrack((queueId) => queueApi.addYouTubePlaylist(queueId, youtubePlaylistId));
	};

	const clear = () => {
		return modifyTrack((queueId) => queueApi.clearQueue(queueId));
	};

	const stop = () => {
		return modifyTrack((queueId) => playerApi.stop(queueId));
	};

	const jam = async (count: number) => {
		if (queue.empty) return;
		const queueId = queue.voiceChannel.id;
		if (!queueId) return;
		await queueApi.jam(queueId, count);
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
		stop,
		pause,
		unpause,
		jam,
	};
};
