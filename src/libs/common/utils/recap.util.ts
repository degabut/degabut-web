export class RecapUtil {
	static getYear() {
		const date = new Date();
		if (date.getMonth() === 11 && date.getDate() >= 15) return date.getFullYear();
		else if (date.getMonth() === 0 && date.getDate() <= 15) return date.getFullYear() - 1;
		else return null;
	}
}
