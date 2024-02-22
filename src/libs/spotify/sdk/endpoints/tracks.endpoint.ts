import type { AudioAnalysis, AudioFeatures, AudioFeaturesCollection, Market, Track, Tracks } from "../types";
import { BaseEndpoint } from "./base";

export class TracksEndpoint extends BaseEndpoint {
	public get(id: string, market?: Market): Promise<Track>;
	public get(ids: string[], market?: Market): Promise<Track[]>;
	public async get(idOrIds: string | string[], market?: Market) {
		if (typeof idOrIds === "string") {
			const params = this.paramsFor({ market });
			return this.getRequest<Track>(`tracks/${idOrIds}${params}`);
		}

		const params = this.paramsFor({ ids: idOrIds, market });
		// TODO: only returns top 20, validate here
		const response = await this.getRequest<Tracks>(`tracks${params}`);
		return response.tracks;
	}

	public audioFeatures(id: string): Promise<AudioFeatures>;
	public audioFeatures(ids: string[]): Promise<AudioFeatures[]>;
	public async audioFeatures(idOrIds: string | string[]) {
		if (typeof idOrIds === "string") {
			return this.getRequest<AudioFeatures>(`audio-features/${idOrIds}`);
		}
		const params = this.paramsFor({ ids: idOrIds });
		const response = await this.getRequest<AudioFeaturesCollection>(`audio-features${params}`);
		return response.audio_features;
	}

	public audioAnalysis(id: string) {
		return this.getRequest<AudioAnalysis>(`audio-analysis/${id}`);
	}
}
