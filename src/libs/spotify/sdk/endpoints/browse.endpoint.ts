import type { Categories, Category, CountryCodeA2, FeaturedPlaylists, MaxInt, NewReleases } from "../types";
import { BaseEndpoint } from "./base";

export class BrowseEndpoint extends BaseEndpoint {
	public getCategories(country?: CountryCodeA2, locale?: string, limit?: MaxInt<50>, offset?: number) {
		const params = this.paramsFor({ country, locale, limit, offset });

		return this.getRequest<Categories>(`browse/categories${params}`);
	}

	public getCategory(categoryId: string, country?: CountryCodeA2, locale?: string) {
		const params = this.paramsFor({ country, locale });

		return this.getRequest<Category>(`browse/categories/${categoryId}${params}`);
	}

	public getNewReleases(country?: string, limit?: MaxInt<50>, offset?: number) {
		const params = this.paramsFor({ country, limit, offset });
		return this.getRequest<NewReleases>(`browse/new-releases${params}`);
	}

	public getFeaturedPlaylists(
		country?: CountryCodeA2,
		locale?: string,
		timestamp?: string,
		limit?: MaxInt<50>,
		offset?: number
	) {
		const params = this.paramsFor({
			country,
			locale,
			timestamp,
			limit,
			offset,
		});
		return this.getRequest<FeaturedPlaylists>(`browse/featured-playlists${params}`);
	}

	public getPlaylistsForCategory(category_id: string, country?: CountryCodeA2, limit?: MaxInt<50>, offset?: number) {
		const params = this.paramsFor({ country, limit, offset });
		return this.getRequest<FeaturedPlaylists>(`browse/categories/${category_id}/playlists${params}`);
	}
}
