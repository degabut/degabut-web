import type { Audiobook, Audiobooks, Market, MaxInt, Page, SimplifiedChapter } from "../types";
import { BaseEndpoint } from "./base";

export class AudiobooksEndpoint extends BaseEndpoint {
	public async get(id: string, market?: Market): Promise<Audiobook>;
	public async get(ids: string[], market?: Market): Promise<Audiobook[]>;
	public async get(idOrIds: string | string[], market?: Market) {
		if (typeof idOrIds === "string") {
			const params = this.paramsFor({ market });
			return this.getRequest<Audiobook>(`audiobooks/${idOrIds}${params}`);
		}

		const params = this.paramsFor({ ids: idOrIds, market });
		const response = await this.getRequest<Audiobooks>(`audiobooks${params}`);
		return response.audiobooks;
	}

	public getAudiobookChapters(id: string, market?: Market, limit?: MaxInt<50>, offset?: number) {
		const params = this.paramsFor({ market, limit, offset });
		return this.getRequest<Page<SimplifiedChapter>>(`audiobooks/${id}/chapters${params}`);
	}
}
