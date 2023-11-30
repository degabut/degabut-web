import { IVideoCompact } from "@youtube/apis";
import { AxiosInstance } from "axios";

type GetVideosParams = { guild?: boolean } | { voiceChannel?: boolean };

const dummy = [
	{
		id: "3AW1TnsWVmE",
		title: "Payung Teduh - Di Atas Meja (Official Lyric Video)",
		duration: 339,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/3AW1TnsWVmE/hqdefault.jpg?sqp=-oaymwEjCOADEI4CSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCOBusHW_reyLy7B48eU2gqfamvhg",
				width: 480,
				height: 270,
			},
		],
		viewCount: 27314719,
		channel: {
			id: "UCBywlDxyIrjDqhE0U3zZvig",
			name: "Payung Teduh Official",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/ytc/APkrFKbGn5amdxexb0tW9SXTGVRrg5Jbk69-vKOHCWEy=s88-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "e_9-EJaz0jc",
		title: "Pusakata - Di Atas Meja |  GOODLIVE Sessions",
		duration: 383,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/e_9-EJaz0jc/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCrPT8pagfCwZsGolY4_dk9L3LACg",
				width: 360,
				height: 202,
			},
			{
				url: "https://i.ytimg.com/vi/e_9-EJaz0jc/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC63TZ-wRctBHPpshiERRbPt2Z8yw",
				width: 720,
				height: 404,
			},
		],
		viewCount: 1336641,
		channel: {
			id: "UC5lrgsB3Mo-RtsuP0HnrLCQ",
			name: "Pophariini",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/iJ2CUhqvww4LgS5k0MgTF2fn8XuwKvHXMbcP2qKAwg4rxaIKcV8ie_EoH68a4snK4jR0ImE1uW8=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "U86xeOCefkg",
		title: "KUMPULAN LAGU PAYUNG TEDUH TERPOPULER 2022 | ON TRENDING | TANPA IKLAN",
		duration: 3029,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/U86xeOCefkg/hqdefault.jpg?sqp=-oaymwE9COADEI4CSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4EgALoAooCDAgAEAEYZSBlKGUwDw==&rs=AOn4CLDinRRjYHYhnmFcNjCeyxAwq7nvBA",
				width: 480,
				height: 270,
			},
		],
		viewCount: 313495,
		channel: {
			id: "UCm-r9FhSOQHlg1boouiAOTg",
			name: "Kibar Gaming",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/ytc/APkrFKa74IQGlY2KGsg524lt_cytiAqoVSGTd46WEvgkKw=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "WlEdHj8FVNw",
		title: "Parade Hujan - Di Atas Meja Live at The Sounds Project Vol.6 (2023)",
		duration: 338,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/WlEdHj8FVNw/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBMuLrER9hY-iygqrJx6VYQiTe4Uw",
				width: 360,
				height: 202,
			},
			{
				url: "https://i.ytimg.com/vi/WlEdHj8FVNw/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBnLC3GC-l27KHmfRq_ehrHvxchLw",
				width: 720,
				height: 404,
			},
		],
		viewCount: 7697,
		channel: {
			id: "UCHnNq1G4BUOBV5K0YFPCOVw",
			name: "The Sounds Project",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/ytc/APkrFKb11XG8B-rx_HezgVDFfVXdymraWji8vJcSXOHdjQ=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "Fzk1Hbs8hZw",
		title: "Payung Teduh - Di Atas Meja (Lirik)",
		duration: 330,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/Fzk1Hbs8hZw/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCep71BnSOdqXC52NgoOfVu7Xi9sQ",
				width: 360,
				height: 202,
			},
			{
				url: "https://i.ytimg.com/vi/Fzk1Hbs8hZw/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDEjLp70km-S2RSWgyROGHVWs3yVQ",
				width: 720,
				height: 404,
			},
		],
		viewCount: 471925,
		channel: {
			id: "UCc1trkxChp32zFK2T7eyTXg",
			name: "About Music",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/ytc/APkrFKZS6WkT9fMuo2LwLUfE4H4_Ts5TeuEobOWU08-C=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "EhjkWH2Al3k",
		title: "DI ATAS MEJA - Bunga Reyza ft. Fivein #LetsJamWithJames",
		duration: 337,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/EhjkWH2Al3k/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBt2jWGWBE9uV5BaGJmWtqDY0nnrQ",
				width: 360,
				height: 202,
			},
			{
				url: "https://i.ytimg.com/vi/EhjkWH2Al3k/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBoHyXti47WRJJ68BHYSINOsCMH6A",
				width: 720,
				height: 404,
			},
		],
		viewCount: 32142,
		channel: {
			id: "UCtAzg-t2cwdmYxdLRPxF2Bg",
			name: "James Adam",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/ytc/APkrFKbrp1Y9uTaXYiAAZXB9QybhrDe-TAmHbV680Wz2KA=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "Y91RLwJGQ7M",
		title: "Payung Teduh - Di Atas Meja",
		duration: 344,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/Y91RLwJGQ7M/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCORb32WvbiKRKOwlzBHl9sWkDwkA",
				width: 360,
				height: 202,
			},
			{
				url: "https://i.ytimg.com/vi/Y91RLwJGQ7M/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCUxQ0IYHs-oyAUci-Tmg4mhl4b2A",
				width: 720,
				height: 404,
			},
		],
		viewCount: 24197,
		channel: {
			id: "UCmkit_wbtLD0dYu-15lEuOg",
			name: "Music Cafe Jakarta",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/qztJfObUEN9A1Bl2lF-z2eER6ftohKGq00OGiCewh-gD35GWMfXYIMjQqAfWr9l7MJpuzeYs=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "gQ0D29mjMXw",
		title: "Pusakata - Diatas Meja Live New Version",
		duration: 364,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/gQ0D29mjMXw/hq720.jpg?sqp=-oaymwE9COgCEMoBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYZSBdKEUwDw==&rs=AOn4CLD9j_pWWDQ4oOMECPftVArhpFII0Q",
				width: 360,
				height: 202,
			},
			{
				url: "https://i.ytimg.com/vi/gQ0D29mjMXw/hq720.jpg?sqp=-oaymwExCNAFEJQDSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYZSBdKEUwDw==&rs=AOn4CLDvt6mYw29z4Nra32T546XpXfesUA",
				width: 720,
				height: 404,
			},
		],
		viewCount: 105447,
		channel: {
			id: "UCOMsIAnrJSd30hdFK-lrT3g",
			name: "Yusthira channel",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/4CQAvnZSaF23-c-1-nJ_QKSatel4bkt3JwOIYzlXTcMg786rDbWa86Hnu0cChRTQxjkvWWGJpw=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "g-dUF2ZvKmc",
		title: "Di Atas Meja – Payung Teduh (KARAOKE PIANO - MALE KEY)",
		duration: 252,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/g-dUF2ZvKmc/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAzYN0hN6Gqt2-tnWcF4iqa6H3G1w",
				width: 360,
				height: 202,
			},
			{
				url: "https://i.ytimg.com/vi/g-dUF2ZvKmc/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLA72GLMhRqcyIi5CWRdUt1bzYu4gQ",
				width: 720,
				height: 404,
			},
		],
		viewCount: 33820,
		channel: {
			id: "UCathSGF4dpmAsDtPlKMvMbA",
			name: "Karaoke Piano",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/ytc/APkrFKYdn_2Iva50tVU7daRuXjOmvGqav8sOAZ62Tjj8_g=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
	{
		id: "FUJDOGPL2hg",
		title: "Payung Teduh - Di Atas Meja (Lirik)",
		duration: 330,
		thumbnails: [
			{
				url: "https://i.ytimg.com/vi/FUJDOGPL2hg/hqdefault.jpg?sqp=-oaymwEjCOADEI4CSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDUf2yTOzDKUYLf6gSUyP7wrf1bBw",
				width: 480,
				height: 270,
			},
		],
		viewCount: 33863,
		channel: {
			id: "UCyt7il8spkgv3dVUCg-RGGQ",
			name: "Happy Sing Lirik",
			thumbnails: [
				{
					url: "https://yt3.ggpht.com/ytc/APkrFKbEcINBSU6sTvSq3uavAgqKmmTgvJQFaGRXK4d6=s68-c-k-c0x00ffffff-no-rj",
					width: 68,
					height: 68,
				},
			],
		},
	},
];

export type GetLastPlayedParams = {
	last: number;
} & GetVideosParams;

export type GetMostPlayedParams = {
	days: number;
	count: number;
} & GetVideosParams;

export type Recap = {
	mostPlayed: IVideoCompact[];
	mostPlayedGroupedByMonth: { month: number; video: IVideoCompact }[];
	timePlayed: number; // seconds
	songsPlayed: number;
	uniqueSongsPlayed: number;
};

export class UserApi {
	constructor(private client: AxiosInstance) {}

	getUserPlayHistory = async (
		id: string,
		params: GetLastPlayedParams | GetMostPlayedParams
	): Promise<IVideoCompact[]> => {
		const response = await this.client.get(`/users/${id}/play-history`, { params });
		if (response.status === 200) return response.data;
		else return [];
	};

	getPlayHistory = async (params: GetLastPlayedParams | GetMostPlayedParams): Promise<IVideoCompact[]> => {
		const response = await this.client.get("/me/play-history", { params });
		if (response.status === 200) return response.data;
		else return [];
	};

	removePlayHistory = async (videoId: string): Promise<void> => {
		await this.client.delete(`/me/play-history/${videoId}`);
	};

	getRecap = async (): Promise<Recap> => {
		return {
			mostPlayed: dummy,
			mostPlayedGroupedByMonth: [
				{
					month: 1,
					video: dummy[0],
				},
			],
			timePlayed: 10000,
			songsPlayed: 100,
			uniqueSongsPlayed: 50,
		};
	};
}
