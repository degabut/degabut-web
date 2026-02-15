import { useApi } from "@common";
import { IS_LINK } from "@constants";
import type { IMediaSource, MediaUrlId } from "@media-source";
import { AxiosError } from "axios";
import type { SetStoreFunction } from "solid-js/store";
import type { FreezeState, IPlayerFiltersState, QueueResource } from "../";
import {
	PlayerApi,
	QueueApi,
	type IChangeAutoplayOptions,
	type IPlayerFilters,
	type ITrack,
	type LoopMode,
} from "../../../apis";

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

	const toggleAutoplay = () => {
		return modifyQueue((queueId) => queueApi.toggleAutoplay(queueId));
	};

	const changeAutoplayOptions = (options: IChangeAutoplayOptions) => {
		return modifyQueue((queueId) => queueApi.changeAutoplayOptions(queueId, options));
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

	const setFilters = (formattedFilters: IPlayerFiltersState) => {
		if (queue.empty) return;

		const filters: IPlayerFilters = {
			equalizer: formattedFilters.equalizer.enabled ? formattedFilters.equalizer.bands : undefined,
			timescale: formattedFilters.timescale.enabled ? formattedFilters.timescale : undefined,
			tremolo: formattedFilters.tremolo.enabled ? formattedFilters.tremolo : undefined,
			vibrato: formattedFilters.vibrato.enabled ? formattedFilters.vibrato : undefined,
			rotation: formattedFilters.rotation.enabled ? formattedFilters.rotation : undefined,
			pluginFilters: {
				echo: formattedFilters.pluginFilters.echo.enabled ? formattedFilters.pluginFilters.echo : undefined,
			},
		};

		return playerApi.setFilters(queue.voiceChannel.id, filters);
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

	const removeTracksByMemberId = (memberId: string) => {
		return modifyTrack((queueId) => queueApi.removeTracksByMemberId(queueId, memberId));
	};

	const addTrack = (mediaSource: IMediaSource) => {
		return modifyTrack((queueId) => queueApi.addTrackById(queueId, mediaSource.id));
	};

	const addTrackById = (id: string | MediaUrlId) => {
		return modifyTrack(async (queueId) => {
			if (typeof id === "string") await queueApi.addTrackById(queueId, id);
			else if (id.type === "youtubeVideoId") await queueApi.addTrackById(queueId, `youtube/${id.value}`);
			else if (id.type === "spotifyTrackId") await queueApi.addTrackById(queueId, `spotify/${id.value}`);
			else if (id.type === "spotifyAlbumId") await queueApi.addSpotifyAlbum(queueId, id.value);
			else if (id.type === "spotifyPlaylistId") await queueApi.addSpotifyPlaylist(queueId, id.value);
			else if (id.type === "youtubePlaylistId") await queueApi.addYouTubePlaylist(queueId, id.value);
		});
	};

	const addTrackByKeyword = (keyword: string) => {
		return modifyTrack((queueId) => queueApi.addTrackByKeyword(queueId, keyword));
	};

	const addAndPlayTrack = (mediaSource: IMediaSource) => {
		return modifyTrack(async (queueId) => {
			let trackId = queue.tracks?.find((t) => t.mediaSource.id === mediaSource.id)?.id;
			if (!trackId) [trackId] = await queueApi.addTrackById(queueId, mediaSource.id);

			try {
				if (queue.nowPlaying) await queueApi.playTrack(queueId, trackId);
				if (queue.isPaused) await playerApi.unpause(queueId);
			} catch {
				// ignore error
			}
		});
	};

	const addNextTrack = (mediaSource: IMediaSource) => {
		return modifyTrack(async (queueId) => {
			let trackId = queue.tracks?.find((t) => t.mediaSource.id === mediaSource.id)?.id;
			if (!trackId) [trackId] = await queueApi.addTrackById(queueId, mediaSource.id);

			if (queue.nowPlaying) queueApi.addNextTrack(queueId, trackId);
		});
	};

	const removeNextTrack = (trackOrId: ITrack | string) => {
		return modifyTrack((queueId) =>
			queueApi.removeNextTrack(queueId, typeof trackOrId === "string" ? trackOrId : trackOrId.id)
		);
	};

	const addLastLiked = (lastLikedCount = 1000) => {
		return modifyTrack((queueId) => queueApi.addLastLiked(queueId, lastLikedCount));
	};

	const addPlaylist = (playlistId: string) => {
		return modifyTrack((queueId) => queueApi.addPlaylist(queueId, playlistId));
	};

	const addYouTubePlaylist = (youtubePlaylistId: string) => {
		return modifyTrack((queueId) => queueApi.addYouTubePlaylist(queueId, youtubePlaylistId));
	};

	const addSpotifyPlaylist = (spotifyPlaylistId: string) => {
		return modifyTrack((queueId) => queueApi.addSpotifyPlaylist(queueId, spotifyPlaylistId));
	};

	const addSpotifyAlbum = (spotifyAlbumId: string) => {
		return modifyTrack((queueId) => queueApi.addSpotifyAlbum(queueId, spotifyAlbumId));
	};

	const clear = (includeNowPlaying = false) => {
		return modifyTrack((queueId) => queueApi.clearQueue(queueId, includeNowPlaying));
	};

	const join = (voiceChannelId: string, textChannelId?: string) => {
		if (!queue.empty) return;
		return playerApi.join(voiceChannelId, textChannelId);
	};

	const stop = () => {
		return modifyTrack((queueId) => (IS_LINK ? queueApi.leave(queueId) : playerApi.stop(queueId)));
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
		toggleAutoplay,
		changeAutoplayOptions,
		changeLoopMode,
		changeTrackOrder,
		skipTrack,
		playTrack,
		removeTrack,
		removeTracksByMemberId,
		addTrack,
		addTrackById,
		addTrackByKeyword,
		addAndPlayTrack,
		addNextTrack,
		removeNextTrack,
		addLastLiked,
		addPlaylist,
		addYouTubePlaylist,
		addSpotifyPlaylist,
		addSpotifyAlbum,
		seek,
		clear,
		join,
		stop,
		pause,
		unpause,
		setFilters,
		jam,
	};
};
