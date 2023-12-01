export class RecapUtil {
	static getYear() {
		const date = new Date();
		if (date.getMonth() === 11) return date.getFullYear();
		else if (date.getMonth() === 0) return date.getFullYear() - 1;
		else return null;
	}
}
