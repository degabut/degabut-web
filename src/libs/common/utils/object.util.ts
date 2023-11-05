/* eslint-disable no-prototype-builtins */

export class ObjectUtil {
	static mergeObjects<T>(obj1: T, obj2: T): T {
		if (typeof obj1 === "object" && obj1 !== null && typeof obj2 === "object" && obj2 !== null) {
			for (const key in obj2) {
				if (obj2.hasOwnProperty(key)) {
					if (obj1.hasOwnProperty(key) && typeof obj1[key] === "object" && typeof obj2[key] === "object") {
						obj1[key] = ObjectUtil.mergeObjects(obj1[key], obj2[key]);
					} else {
						obj1[key] = obj2[key];
					}
				}
			}
		}
		return obj1;
	}

	static findDifference<T extends Record<string, unknown>>(
		before: T,
		after: T
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	): { key: string; before: any; after: any } | null {
		for (const key in after) {
			// if object, compare using json, if not compare using ===
			if (typeof after[key] === "object" && typeof before[key] === "object") {
				if (JSON.stringify(after[key]) !== JSON.stringify(before[key])) {
					return { key, before: before[key], after: after[key] };
				}
			} else if (after[key] !== before[key]) {
				return { key, before: before[key], after: after[key] };
			}
		}
		return null;
	}
}
