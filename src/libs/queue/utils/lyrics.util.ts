// from https://github.com/notigorwastaken/lrclib-api/blob/main/packages/lrclib-api/src/utils.ts

type SyncedLyricLine = {
	text: string;
	startTime: number;
};

type UnsyncedLyricLine = {
	text: string;
};

type ParsedLyrics = {
	synced: SyncedLyricLine[] | null;
	unsynced: UnsyncedLyricLine[];
};

export class LyricsUtil {
	public static parse(lyrics: string): ParsedLyrics {
		// Preprocess lyrics by removing [tags] (e.g., [artist:Name]) and trimming extra whitespace
		const lines = lyrics
			.replace(/\[[a-zA-Z]+:.+\]/g, "") // Removes metadata tags like [artist:Name]
			.trim()
			.split("\n"); // Splits the lyrics into an array of lines

		// Regular expressions for matching synced and karaoke timestamps
		const syncedTimestamp = /\[([0-9:.]+)\]/; // Matches [00:12.34]

		const unsynced: UnsyncedLyricLine[] = []; // Array to store unsynchronized lyrics
		const synced: SyncedLyricLine[] = []; // Array to store synchronized lyrics

		// Process each line to extract lyrics and timing information
		lines.forEach((line) => {
			// Match synchronized lyrics
			const syncMatch = line.match(syncedTimestamp);
			if (syncMatch) {
				const startTime = this.parseTime(syncMatch[1]);
				const text = line.replace(syncedTimestamp, "").trim();
				if (text) {
					synced.push({ text, startTime });
				}
			}
			// Add to unsynchronized lyrics if no timestamps are found
			else {
				const text = line.trim();
				if (text) {
					unsynced.push({ text });
				}
			}
		});

		return {
			synced: synced.length > 0 ? synced : null,
			unsynced,
		};
	}

	private static parseTime(time: string): number {
		const [minutes, seconds] = time.split(":").map(Number);
		return minutes * 60 + seconds;
	}
}
