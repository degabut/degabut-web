export class UrlUtil {
	static toAbsolute(url: string) {
		if (url.startsWith("http")) return url;
		return location.protocol + "//" + location.host + url;
	}
}
