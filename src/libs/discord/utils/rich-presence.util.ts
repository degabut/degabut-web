import type { IRichPresence, IRichPresenceAsset, IRichPresencePlaceholder, IRichPresenceTemplate } from "../hooks";

export class RichPresenceUtil {
	static parseTemplate(
		template: IRichPresenceTemplate,
		placeholder: IRichPresencePlaceholder,
		assets?: IRichPresenceAsset[]
	) {
		const result: IRichPresenceTemplate = { ...template };

		for (const key of Object.keys(result) as Array<keyof IRichPresenceTemplate>) {
			for (const [pKey, pValue] of Object.entries(placeholder)) {
				result[key] = result[key].replace(`{${pKey}}`, pValue);
			}
		}

		if (assets) {
			for (const asset of assets) {
				if (asset.name === result.smallImageKey) result.smallImageKey = asset.url;
				if (asset.name === result.largeImageKey) result.largeImageKey = asset.url;
			}
		}

		return result;
	}

	static toPresence(template: Partial<IRichPresence>) {
		return <IRichPresence>{
			details: template.details,
			state: template.state || undefined,
			largeImageKey: template.largeImageKey,
			largeImageText: template.largeImageText,
			smallImageKey: template.smallImageKey || undefined,
			smallImageText: template.smallImageText || undefined,
			buttons: template.buttons || undefined,
			startTimestamp: template.startTimestamp || undefined,
		};
	}
}
