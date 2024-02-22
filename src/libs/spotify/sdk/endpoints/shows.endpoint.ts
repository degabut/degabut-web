import type { Market, MaxInt, Page, Show, Shows, SimplifiedEpisode } from "../types";
import { BaseEndpoint } from "./base";

export class ShowsEndpoint extends BaseEndpoint {
	public get(id: string, market: Market): Promise<Show>;
	public get(ids: string[], market: Market): Promise<Show[]>;
	public async get(idOrIds: string | string[], market: Market) {
		if (typeof idOrIds === "string") {
			const params = this.paramsFor({ market });
			return this.getRequest<Show>(`shows/${idOrIds}${params}`);
		}

		// TODO: only returns 50, validate here
		const params = this.paramsFor({ ids: idOrIds, market });
		const response = await this.getRequest<Shows>(`shows${params}`);
		return response.shows;
	}

	public episodes(id: string, market?: Market, limit?: MaxInt<50>, offset?: number) {
		const params = this.paramsFor({ market, limit, offset });
		return this.getRequest<Page<SimplifiedEpisode>>(`shows/${id}/episodes${params}`);
	}
}
