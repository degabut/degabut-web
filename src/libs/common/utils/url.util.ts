export type PatchPathParams = Record<string, string | number | boolean | null | undefined>;

export class UrlUtil {
	static toAbsolute(url: string) {
		if (url.startsWith("http")) return url;
		return location.protocol + "//" + location.host + url;
	}

	static patchPath(path: string, params?: PatchPathParams): string {
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				path = path.replace(
					new RegExp(`(?<!\\w):${key}\\??(?!\\w)`, "g"),
					encodeURIComponent(value?.toString() || "")
				);
			}
		}

		path = path.replace(/\/?:\w+\?/g, "");

		return path;
	}
}
