export class RandomUtil {
	static number(min: number, max: number, decimalPlaces: number = 0): number {
		const rand = Math.random() * (max - min) + min;
		const power = Math.pow(10, decimalPlaces);
		return Math.floor(rand * power) / power;
	}
}
