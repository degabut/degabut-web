import { AxiosResponse } from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MatchAndRewriteURLInputs {
	originalUrl: URL;
	prefixHost: string;
	prefix: string;
	target: string;
}

export interface Mapping {
	prefix: string;
	target: string;
}

export class PatchUrlUtil {
	static SUBSTITUTION_REGEX = /\{([a-z]+)\}/g;

	static intercept(response: AxiosResponse, mappings: Mapping[]) {
		const responseString = PatchUrlUtil.rewriteString(JSON.stringify(response.data), mappings);
		response.data = JSON.parse(responseString);
		return response;
	}

	static patchWebSocket(mappings: Mapping[]) {
		class InterceptedWebSocket extends WebSocket {
			constructor(url: string, protocols?: string | string[]) {
				super(url, protocols);
			}

			set onmessage(event: (ev: MessageEvent) => any) {
				super.onmessage = (ev: MessageEvent) => {
					let data = ev.data;
					data = PatchUrlUtil.rewriteString(data, mappings);
					if (event) event({ ...ev, data });
				};
			}
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		window.WebSocket = InterceptedWebSocket;
	}

	private static rewriteString(original: string, mappings: Mapping[]): string {
		for (const mapping of mappings) {
			const targetUrl = `https://${mapping.target}`.replace(/%7B/g, "{").replace(/%7D/g, "}");
			const targetRegEx = PatchUrlUtil.regexFromTarget(targetUrl, "g");
			const match = original.match(targetRegEx);
			if (match == null) continue;

			original = original.replace(targetRegEx, (url) => {
				const newUrl = PatchUrlUtil.matchAndRewriteUrl({
					originalUrl: new URL(url),
					prefix: mapping.prefix,
					target: mapping.target,
					prefixHost: window.location.host,
				});

				return newUrl?.toString() || "";
			});
		}

		return original;
	}

	// TODO move
	private static regexFromTarget(target: string, flag?: string): RegExp {
		const regexString = target.replace(PatchUrlUtil.SUBSTITUTION_REGEX, (_, name) => `(?<${name}>[\\w-]+)`);
		return new RegExp(`${regexString}(/|$)`, flag);
	}

	// TODO move
	private static matchAndRewriteUrl({
		originalUrl,
		prefix,
		prefixHost,
		target,
	}: MatchAndRewriteURLInputs): URL | null {
		// coerce url with filler https protocol so we can retrieve host and pathname from target
		const targetURL = new URL(`https://${target}`);
		// Depending on the environment, the URL constructor may turn `{` and `}` into `%7B` and `%7D`, respectively
		const targetRegEx = PatchUrlUtil.regexFromTarget(targetURL.host.replace(/%7B/g, "{").replace(/%7D/g, "}"));
		const match = originalUrl.toString().match(targetRegEx);
		// Null match indicates that this target is not relevant
		if (match == null) return originalUrl;
		const newURL = new URL(originalUrl.toString());
		newURL.host = prefixHost;
		newURL.pathname = prefix.replace(PatchUrlUtil.SUBSTITUTION_REGEX, (_, matchName) => {
			const replaceValue = match.groups?.[matchName];
			if (replaceValue == null) throw new Error("Misconfigured route.");
			return replaceValue;
		});

		// Append the original path
		newURL.pathname += newURL.pathname === "/" ? originalUrl.pathname.slice(1) : originalUrl.pathname;
		// Remove the target's path from the new url path
		newURL.pathname = newURL.pathname.replace(targetURL.pathname, "");
		// Add a trailing slash if original url had it, and if it doesn't already have one
		if (originalUrl.pathname.endsWith("/") && !newURL.pathname.endsWith("/")) newURL.pathname += "/";
		return newURL;
	}
}
