import { IVideoCompact } from "@youtube/apis";
import { AxiosInstance } from "axios";

type GetVideosParams = { guild?: boolean } | { voiceChannel?: boolean };

const dummy = {
	mostPlayed: [
		{
			videoId: "3AW1TnsWVmE",
			count: 339,
			video: {
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
				viewCount: 0,
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
		},
		{
			videoId: "9lVPAWLWtWc",
			count: 322,
			video: {
				id: "9lVPAWLWtWc",
				title: "ヨルシカ - 花に亡霊（OFFICIAL VIDEO）",
				duration: 242,
				thumbnails: [
					{
						url: "https://i.ytimg.com/vi/9lVPAWLWtWc/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLALX7mCVSPzb0j94yhqrNaRN3iRKw",
						width: 168,
						height: 94,
					},
					{
						url: "https://i.ytimg.com/vi/9lVPAWLWtWc/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLBLiR-kodhJePXGnDsA-f98M2wf8A",
						width: 196,
						height: 110,
					},
					{
						url: "https://i.ytimg.com/vi/9lVPAWLWtWc/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAytyIivGxJNaSmA5WXBOIuSxrcXA",
						width: 246,
						height: 138,
					},
					{
						url: "https://i.ytimg.com/vi/9lVPAWLWtWc/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBn9Ff0NObNmGtLbnVW7BOx_f4VJQ",
						width: 336,
						height: 188,
					},
					{
						url: "https://i.ytimg.com/vi/9lVPAWLWtWc/maxresdefault.jpg",
						width: 1920,
						height: 1080,
					},
				],
				viewCount: 0,
				channel: {
					id: "UCRIgIJQWuBJ0Cv_VlU3USNA",
					name: "ヨルシカ / n-buna Official",
					thumbnails: [
						{
							url: "https://yt3.ggpht.com/ytc/APkrFKYUTRx5y3EaqRd8qpINu69SVluexa811r7WPdfG=s48-c-k-c0x00ffffff-no-rj-mo",
							width: 48,
							height: 48,
						},
						{
							url: "https://yt3.ggpht.com/ytc/APkrFKYUTRx5y3EaqRd8qpINu69SVluexa811r7WPdfG=s88-c-k-c0x00ffffff-no-rj-mo",
							width: 88,
							height: 88,
						},
						{
							url: "https://yt3.ggpht.com/ytc/APkrFKYUTRx5y3EaqRd8qpINu69SVluexa811r7WPdfG=s176-c-k-c0x00ffffff-no-rj-mo",
							width: 176,
							height: 176,
						},
					],
				},
			},
		},
		{
			videoId: "PDJPpG8e4n4",
			count: 310,
			video: {
				id: "PDJPpG8e4n4",
				title: "Keep On Loving You - Cigarettes After Sex",
				duration: 233,
				thumbnails: [
					{
						url: "https://i.ytimg.com/vi/PDJPpG8e4n4/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLC2zgk4ea5_i8fvuHlMgejh3hevvQ",
						width: 168,
						height: 94,
					},
					{
						url: "https://i.ytimg.com/vi/PDJPpG8e4n4/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCEcUdOiaKLcDtdJuruWcQV67jPHQ",
						width: 196,
						height: 110,
					},
					{
						url: "https://i.ytimg.com/vi/PDJPpG8e4n4/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAAnCCZOsfgK9-JqdEAwO0jUQgxpg",
						width: 246,
						height: 138,
					},
					{
						url: "https://i.ytimg.com/vi/PDJPpG8e4n4/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBGzURG5spfrdnnj2Ecw-yggEBrWw",
						width: 336,
						height: 188,
					},
					{
						url: "https://i.ytimg.com/vi/PDJPpG8e4n4/maxresdefault.jpg",
						width: 1920,
						height: 1080,
					},
				],
				viewCount: 0,
				channel: {
					id: "UCqNxhPZoLJ81i5QaK4nqn8A",
					name: "Cigarettes After Sex",
					thumbnails: [
						{
							url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s48-c-k-c0x00ffffff-no-nd-rj",
							width: 48,
							height: 48,
						},
						{
							url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s88-c-k-c0x00ffffff-no-nd-rj",
							width: 88,
							height: 88,
						},
						{
							url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s176-c-k-c0x00ffffff-no-nd-rj",
							width: 176,
							height: 176,
						},
					],
				},
			},
		},
		{
			videoId: "owsS1TcoJbo",
			count: 291,
			video: {
				id: "owsS1TcoJbo",
				title: "King and Country",
				duration: 245,
				thumbnails: [
					{
						url: "https://i.ytimg.com/vi/owsS1TcoJbo/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLDn7ytLonfJ-X2RUrQtTRjwYkH7BA",
						width: 168,
						height: 94,
					},
					{
						url: "https://i.ytimg.com/vi/owsS1TcoJbo/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLDYg0Hwdq419Orgzl4sCImTWvdf2A",
						width: 196,
						height: 110,
					},
					{
						url: "https://i.ytimg.com/vi/owsS1TcoJbo/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCfgoabvaqV01w3iQ3Wd2gFVNXyQQ",
						width: 246,
						height: 138,
					},
					{
						url: "https://i.ytimg.com/vi/owsS1TcoJbo/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDvS_00Sh80Rg4Et7AONYeR8rWE6A",
						width: 336,
						height: 188,
					},
					{
						url: "https://i.ytimg.com/vi/owsS1TcoJbo/maxresdefault.jpg",
						width: 1920,
						height: 1080,
					},
				],
				viewCount: 0,
				channel: {
					id: "UCxgUgElia2ZNaW_xWMuCikQ",
					name: "Jeremy Soule - Topic",
					thumbnails: [
						{
							url: "https://yt3.ggpht.com/PacHOA7m8bhIbPXH0TY7GBpy8QTQFnMRSTSE7VUG5n7i10Ov3VOlLKtn_CjMgswiHdwynyHc=s48-c-k-c0x00ffffff-no-rj",
							width: 48,
							height: 48,
						},
						{
							url: "https://yt3.ggpht.com/PacHOA7m8bhIbPXH0TY7GBpy8QTQFnMRSTSE7VUG5n7i10Ov3VOlLKtn_CjMgswiHdwynyHc=s88-c-k-c0x00ffffff-no-rj",
							width: 88,
							height: 88,
						},
						{
							url: "https://yt3.ggpht.com/PacHOA7m8bhIbPXH0TY7GBpy8QTQFnMRSTSE7VUG5n7i10Ov3VOlLKtn_CjMgswiHdwynyHc=s176-c-k-c0x00ffffff-no-rj",
							width: 176,
							height: 176,
						},
					],
				},
			},
		},
		{
			videoId: "ftibBfIKdsI",
			count: 265,
			video: {
				id: "ftibBfIKdsI",
				title: "Fiji Blue - I'm So Far (Demo)",
				duration: 189,
				thumbnails: [
					{
						url: "https://i.ytimg.com/vi/ftibBfIKdsI/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLD8qhy3sQFTo7mztr_J9uO_O93IOQ",
						width: 168,
						height: 94,
					},
					{
						url: "https://i.ytimg.com/vi/ftibBfIKdsI/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCwLVl7VpvntDwmckHgjYBmaHhBAQ",
						width: 196,
						height: 110,
					},
					{
						url: "https://i.ytimg.com/vi/ftibBfIKdsI/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBKAEpiPzn_GG4HrTjKl9Tt5zffGw",
						width: 246,
						height: 138,
					},
					{
						url: "https://i.ytimg.com/vi/ftibBfIKdsI/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAAZ_VBZGkq74dSFA_Lp5L2_5OJqw",
						width: 336,
						height: 188,
					},
					{
						url: "https://i.ytimg.com/vi/ftibBfIKdsI/maxresdefault.jpg",
						width: 1920,
						height: 1080,
					},
				],
				viewCount: 0,
				channel: {
					id: "UCM7OPaFwk6VXOnbW6Uo2wCw",
					name: "Fiji Blue",
					thumbnails: [
						{
							url: "https://yt3.ggpht.com/4fpo1JoBwDypa8oVBbDm5qlwZ7elViEH3XKGTJH-K1AWtzVduJ0_Zl_7RO2CQlWlHJ2Yiwjz=s48-c-k-c0x00ffffff-no-nd-rj",
							width: 48,
							height: 48,
						},
						{
							url: "https://yt3.ggpht.com/4fpo1JoBwDypa8oVBbDm5qlwZ7elViEH3XKGTJH-K1AWtzVduJ0_Zl_7RO2CQlWlHJ2Yiwjz=s88-c-k-c0x00ffffff-no-nd-rj",
							width: 88,
							height: 88,
						},
						{
							url: "https://yt3.ggpht.com/4fpo1JoBwDypa8oVBbDm5qlwZ7elViEH3XKGTJH-K1AWtzVduJ0_Zl_7RO2CQlWlHJ2Yiwjz=s176-c-k-c0x00ffffff-no-nd-rj",
							width: 176,
							height: 176,
						},
					],
				},
			},
		},
	],
	monthly: [
		{
			month: 0,
			songPlayed: 38,
			durationPlayed: 9830,
			songListened: 0,
			durationListened: 0,
			mostPlayed: {
				videoId: "oeN8_mtAiVA",
				count: 12,
				video: {
					id: "oeN8_mtAiVA",
					title: "Red Light",
					duration: 325,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/oeN8_mtAiVA/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLC3zMlZ-KIhHo36rmN6ufhslhwyqg",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/oeN8_mtAiVA/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLBiNFHALpXkXZjVPdidItE-wAgDYw",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/oeN8_mtAiVA/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCzOu1jiWKy06Foqcu1mu0V90Mq5Q",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/oeN8_mtAiVA/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLD-PJ_Jnvrb6qhduRoF-Q3av-Teqg",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/oeN8_mtAiVA/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCM1hUAJDveuj547WljTMJJQ",
						name: "thepaperkitesband",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/TGxP0ELxRUqUMuqVtCa1uSm5aKDGaJtko740GNS_DyJ5Myd4yPgXad-SDgmhEiCEY4_tldzVLKU=s48-c-k-c0x00ffffff-no-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/TGxP0ELxRUqUMuqVtCa1uSm5aKDGaJtko740GNS_DyJ5Myd4yPgXad-SDgmhEiCEY4_tldzVLKU=s88-c-k-c0x00ffffff-no-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/TGxP0ELxRUqUMuqVtCa1uSm5aKDGaJtko740GNS_DyJ5Myd4yPgXad-SDgmhEiCEY4_tldzVLKU=s176-c-k-c0x00ffffff-no-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 1,
			songPlayed: 1200,
			durationPlayed: 331301,
			songListened: 0,
			durationListened: 0,
			mostPlayed: {
				videoId: "nVLN3VH6mHY",
				count: 98,
				video: {
					id: "nVLN3VH6mHY",
					title: "ヘクとパスカル- fish in the pool [中文字幕]",
					duration: 279,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/nVLN3VH6mHY/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLA6z2TNpoIu9kIbR-QWl8PMP_wJgw",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/nVLN3VH6mHY/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCIltm9qRiCUdtjN5WTeuC9XQYSqQ",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/nVLN3VH6mHY/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDvRlmBcqXdnCD7JKMNc0Yc9aI_Qw",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/nVLN3VH6mHY/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCybmBlUR7OiMMMYgmavJm1aPZPfQ",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/nVLN3VH6mHY/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCw8pRdE1h8q_JXxabd39Gyg",
						name: "LINLIN YIN",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKblT-vVYcFtw0Fd5waLg6oKq-xvXFtTxTzqi2gagg=s48-c-k-c0x00ffffff-no-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKblT-vVYcFtw0Fd5waLg6oKq-xvXFtTxTzqi2gagg=s88-c-k-c0x00ffffff-no-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKblT-vVYcFtw0Fd5waLg6oKq-xvXFtTxTzqi2gagg=s176-c-k-c0x00ffffff-no-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 2,
			songPlayed: 523,
			durationPlayed: 125803,
			songListened: 0,
			durationListened: 0,
			mostPlayed: {
				videoId: "ZcZYYdlq6oY",
				count: 61,
				video: {
					id: "ZcZYYdlq6oY",
					title: "Sarah Kang - Goodnight | Español / Lyrics",
					duration: 177,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/ZcZYYdlq6oY/hqdefault.jpg?sqp=-oaymwE8CKgBEF5IWvKriqkDLwgBFQAAAAAYASUAAMhCPQCAokN4AfABAfgB_gmAAtAFigIMCAAQARhyIEooLjAP&rs=AOn4CLBIN5AZ70T7fwEGtqD0o2lvLRNP4w",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/ZcZYYdlq6oY/hqdefault.jpg?sqp=-oaymwE8CMQBEG5IWvKriqkDLwgBFQAAAAAYASUAAMhCPQCAokN4AfABAfgB_gmAAtAFigIMCAAQARhyIEooLjAP&rs=AOn4CLCZBBuhd6SzSUwae3pmyXBXSzyvfg",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/ZcZYYdlq6oY/hqdefault.jpg?sqp=-oaymwE9CPYBEIoBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYciBKKC4wDw==&rs=AOn4CLCkHo5sKs3dV2LWCDkoSm3k6zDUTg",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/ZcZYYdlq6oY/hqdefault.jpg?sqp=-oaymwE9CNACELwBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYciBKKC4wDw==&rs=AOn4CLC-UyAbcV26PM5vAlm1616aEeqXgQ",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/ZcZYYdlq6oY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgSiguMA8=&rs=AOn4CLBcHrw1ouK3qVrMyME4oDhleTwRbg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCPmzAQcLtjUoDMfDpfHQ6_g",
						name: "Susu",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/ytc/AGIKgqMKrCh_FoO8N-o_PZrBJioIPzYpQFgjjxXfMxaaEA=s48-c-k-c0x00ffffff-no-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/ytc/AGIKgqMKrCh_FoO8N-o_PZrBJioIPzYpQFgjjxXfMxaaEA=s88-c-k-c0x00ffffff-no-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/ytc/AGIKgqMKrCh_FoO8N-o_PZrBJioIPzYpQFgjjxXfMxaaEA=s176-c-k-c0x00ffffff-no-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 3,
			songPlayed: 205,
			durationPlayed: 58197,
			songListened: 0,
			durationListened: 0,
			mostPlayed: {
				videoId: "PDJPpG8e4n4",
				count: 18,
				video: {
					id: "PDJPpG8e4n4",
					title: "Keep On Loving You - Cigarettes After Sex",
					duration: 233,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/PDJPpG8e4n4/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLC2zgk4ea5_i8fvuHlMgejh3hevvQ",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/PDJPpG8e4n4/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCEcUdOiaKLcDtdJuruWcQV67jPHQ",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/PDJPpG8e4n4/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAAnCCZOsfgK9-JqdEAwO0jUQgxpg",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/PDJPpG8e4n4/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBGzURG5spfrdnnj2Ecw-yggEBrWw",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/PDJPpG8e4n4/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCqNxhPZoLJ81i5QaK4nqn8A",
						name: "Cigarettes After Sex",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s48-c-k-c0x00ffffff-no-nd-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s88-c-k-c0x00ffffff-no-nd-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s176-c-k-c0x00ffffff-no-nd-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 4,
			songPlayed: 1779,
			durationPlayed: 561746,
			songListened: 0,
			durationListened: 0,
			mostPlayed: {
				videoId: "In9V-SFAldA",
				count: 142,
				video: {
					id: "In9V-SFAldA",
					title: "Sweet",
					duration: 292,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/In9V-SFAldA/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCIf3lC9ztwvAjkFSJIouDC2Tsp6w",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/In9V-SFAldA/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCuxFE3qiPUAlR3LTLVWGbQ8463oQ",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/In9V-SFAldA/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCEo2yNsZb2gT3PqfNP0kNeZ1DMgw",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/In9V-SFAldA/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCY8QbkFOKsa8335nJblFduNUog0A",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/In9V-SFAldA/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCqNxhPZoLJ81i5QaK4nqn8A",
						name: "Cigarettes After Sex",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s48-c-k-c0x00ffffff-no-nd-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s88-c-k-c0x00ffffff-no-nd-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/KyYunmQCF1ixX3KuH6lfs5EWqdrgcxNM8USvOpxmPztIY9x0s70E40nRFLa3dZvk83dx3hQh=s176-c-k-c0x00ffffff-no-nd-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 5,
			songPlayed: 592,
			durationPlayed: 148513,
			songListened: 1003,
			durationListened: 238814,
			mostPlayed: {
				videoId: "D7qDcurxu_o",
				count: 78,
				video: {
					id: "D7qDcurxu_o",
					title: "1000 Tahun Lamanya",
					duration: 232,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLBus_ejoWOyS0OqMD8mYgcDoOxILw",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLC6TLPbZzY0bRvUnujLb7WPr2PuKg",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAr6-r0EKQSTJ3wz4o1lJJZDSs87g",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAqwFv4NKycTGG2JeiBfVi1-MmWLg",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCRggxhdYIz0zSvUgJmCWMGg",
						name: "Tulus",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/564wbsfhipcNB1kLFlgD-_tnN4ejPs1ZLzXj4uQ4RE5xhSPiUHOazHDGAVY4ZLHKeDZTkRDhgQ=s48-c-k-c0x00ffffff-no-nd-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/564wbsfhipcNB1kLFlgD-_tnN4ejPs1ZLzXj4uQ4RE5xhSPiUHOazHDGAVY4ZLHKeDZTkRDhgQ=s88-c-k-c0x00ffffff-no-nd-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/564wbsfhipcNB1kLFlgD-_tnN4ejPs1ZLzXj4uQ4RE5xhSPiUHOazHDGAVY4ZLHKeDZTkRDhgQ=s176-c-k-c0x00ffffff-no-nd-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 6,
			songPlayed: 455,
			durationPlayed: 215015,
			songListened: 910,
			durationListened: 341654,
			mostPlayed: {
				videoId: "owsS1TcoJbo",
				count: 106,
				video: {
					id: "owsS1TcoJbo",
					title: "King and Country",
					duration: 245,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/owsS1TcoJbo/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLDn7ytLonfJ-X2RUrQtTRjwYkH7BA",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/owsS1TcoJbo/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLDYg0Hwdq419Orgzl4sCImTWvdf2A",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/owsS1TcoJbo/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCfgoabvaqV01w3iQ3Wd2gFVNXyQQ",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/owsS1TcoJbo/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDvS_00Sh80Rg4Et7AONYeR8rWE6A",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/owsS1TcoJbo/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCxgUgElia2ZNaW_xWMuCikQ",
						name: "Jeremy Soule - Topic",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/PacHOA7m8bhIbPXH0TY7GBpy8QTQFnMRSTSE7VUG5n7i10Ov3VOlLKtn_CjMgswiHdwynyHc=s48-c-k-c0x00ffffff-no-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/PacHOA7m8bhIbPXH0TY7GBpy8QTQFnMRSTSE7VUG5n7i10Ov3VOlLKtn_CjMgswiHdwynyHc=s88-c-k-c0x00ffffff-no-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/PacHOA7m8bhIbPXH0TY7GBpy8QTQFnMRSTSE7VUG5n7i10Ov3VOlLKtn_CjMgswiHdwynyHc=s176-c-k-c0x00ffffff-no-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 7,
			songPlayed: 471,
			durationPlayed: 133930,
			songListened: 1276,
			durationListened: 336888,
			mostPlayed: {
				videoId: "D7qDcurxu_o",
				count: 55,
				video: {
					id: "D7qDcurxu_o",
					title: "1000 Tahun Lamanya",
					duration: 232,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLBus_ejoWOyS0OqMD8mYgcDoOxILw",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLC6TLPbZzY0bRvUnujLb7WPr2PuKg",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAr6-r0EKQSTJ3wz4o1lJJZDSs87g",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAqwFv4NKycTGG2JeiBfVi1-MmWLg",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/D7qDcurxu_o/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCRggxhdYIz0zSvUgJmCWMGg",
						name: "Tulus",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/564wbsfhipcNB1kLFlgD-_tnN4ejPs1ZLzXj4uQ4RE5xhSPiUHOazHDGAVY4ZLHKeDZTkRDhgQ=s48-c-k-c0x00ffffff-no-nd-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/564wbsfhipcNB1kLFlgD-_tnN4ejPs1ZLzXj4uQ4RE5xhSPiUHOazHDGAVY4ZLHKeDZTkRDhgQ=s88-c-k-c0x00ffffff-no-nd-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/564wbsfhipcNB1kLFlgD-_tnN4ejPs1ZLzXj4uQ4RE5xhSPiUHOazHDGAVY4ZLHKeDZTkRDhgQ=s176-c-k-c0x00ffffff-no-nd-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 8,
			songPlayed: 1054,
			durationPlayed: 281405,
			songListened: 2955,
			durationListened: 745709,
			mostPlayed: {
				videoId: "9lVPAWLWtWc",
				count: 101,
				video: {
					id: "9lVPAWLWtWc",
					title: "ヨルシカ - 花に亡霊（OFFICIAL VIDEO）",
					duration: 242,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/9lVPAWLWtWc/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLALX7mCVSPzb0j94yhqrNaRN3iRKw",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/9lVPAWLWtWc/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLBLiR-kodhJePXGnDsA-f98M2wf8A",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/9lVPAWLWtWc/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAytyIivGxJNaSmA5WXBOIuSxrcXA",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/9lVPAWLWtWc/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBn9Ff0NObNmGtLbnVW7BOx_f4VJQ",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/9lVPAWLWtWc/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCRIgIJQWuBJ0Cv_VlU3USNA",
						name: "ヨルシカ / n-buna Official",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKYUTRx5y3EaqRd8qpINu69SVluexa811r7WPdfG=s48-c-k-c0x00ffffff-no-rj-mo",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKYUTRx5y3EaqRd8qpINu69SVluexa811r7WPdfG=s88-c-k-c0x00ffffff-no-rj-mo",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKYUTRx5y3EaqRd8qpINu69SVluexa811r7WPdfG=s176-c-k-c0x00ffffff-no-rj-mo",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 9,
			songPlayed: 1195,
			durationPlayed: 327785,
			songListened: 2871,
			durationListened: 796375,
			mostPlayed: {
				videoId: "c_JK0sbY6QU",
				count: 188,
				video: {
					id: "c_JK0sbY6QU",
					title: "goodnight (feat. Juju B. Goode) by Sarah Kang [official lyric video]",
					duration: 177,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/c_JK0sbY6QU/hqdefault.jpg?sqp=-oaymwE8CKgBEF5IWvKriqkDLwgBFQAAAAAYASUAAMhCPQCAokN4AfABAfgB_gmAAtAFigIMCAAQARh_ID8oGzAP&rs=AOn4CLB0yaGwjCwyewJyvMRZ8yXOhBQ0-Q",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/c_JK0sbY6QU/hqdefault.jpg?sqp=-oaymwE8CMQBEG5IWvKriqkDLwgBFQAAAAAYASUAAMhCPQCAokN4AfABAfgB_gmAAtAFigIMCAAQARh_ID8oGzAP&rs=AOn4CLBWT3ZkN9rZCsOWKxBXtX3PQN4NoA",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/c_JK0sbY6QU/hqdefault.jpg?sqp=-oaymwE9CPYBEIoBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYfyA_KBswDw==&rs=AOn4CLAMwMjlDRO03LroC7Ubmj7fF8bj9w",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/c_JK0sbY6QU/hqdefault.jpg?sqp=-oaymwE9CNACELwBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYfyA_KBswDw==&rs=AOn4CLBVMRvoP7SvmmJovT6qHZUZBca2KQ",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/c_JK0sbY6QU/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGH8gPygbMA8=&rs=AOn4CLD1IDM-hVclSw-JIilS27crNUDatA",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UC8GFv0g53idj1GtuTAeuN-g",
						name: "Sarah Kang Music",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/9gwvkE76rs2-nneUXJxtLe_rMyrPvxBTL28uvI17DTVokpisg82-f5segrxYor-cFT47-eUdew=s48-c-k-c0x00ffffff-no-nd-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/9gwvkE76rs2-nneUXJxtLe_rMyrPvxBTL28uvI17DTVokpisg82-f5segrxYor-cFT47-eUdew=s88-c-k-c0x00ffffff-no-nd-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/9gwvkE76rs2-nneUXJxtLe_rMyrPvxBTL28uvI17DTVokpisg82-f5segrxYor-cFT47-eUdew=s176-c-k-c0x00ffffff-no-nd-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 10,
			songPlayed: 753,
			durationPlayed: 343906,
			songListened: 1586,
			durationListened: 566666,
			mostPlayed: {
				videoId: "G03KNr5EgpM",
				count: 130,
				video: {
					id: "G03KNr5EgpM",
					title: "once in a moon by Sarah Kang (lyric video)",
					duration: 245,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/G03KNr5EgpM/hqdefault.jpg?sqp=-oaymwE8CKgBEF5IWvKriqkDLwgBFQAAAAAYASUAAMhCPQCAokN4AfABAfgB_gmAAtAFigIMCAAQARhlIEMoWTAP&rs=AOn4CLC7wUYiaCPvXIHX3AVUrLtwfEQ28g",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/G03KNr5EgpM/hqdefault.jpg?sqp=-oaymwE8CMQBEG5IWvKriqkDLwgBFQAAAAAYASUAAMhCPQCAokN4AfABAfgB_gmAAtAFigIMCAAQARhlIEMoWTAP&rs=AOn4CLDfM3VRNUTBz3LvrGmRsHFIxr30gg",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/G03KNr5EgpM/hqdefault.jpg?sqp=-oaymwE9CPYBEIoBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYZSBDKFkwDw==&rs=AOn4CLCmWoZZgfmpdIbcPP-roUvC6kKQHA",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/G03KNr5EgpM/hqdefault.jpg?sqp=-oaymwE9CNACELwBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYZSBDKFkwDw==&rs=AOn4CLBO6c1NTbNALsE5E46Q6FJyHYk3Yg",
							width: 336,
							height: 188,
						},
					],
					viewCount: 0,
					channel: {
						id: "UC8GFv0g53idj1GtuTAeuN-g",
						name: "Sarah Kang Music",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/9gwvkE76rs2-nneUXJxtLe_rMyrPvxBTL28uvI17DTVokpisg82-f5segrxYor-cFT47-eUdew=s48-c-k-c0x00ffffff-no-nd-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/9gwvkE76rs2-nneUXJxtLe_rMyrPvxBTL28uvI17DTVokpisg82-f5segrxYor-cFT47-eUdew=s88-c-k-c0x00ffffff-no-nd-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/9gwvkE76rs2-nneUXJxtLe_rMyrPvxBTL28uvI17DTVokpisg82-f5segrxYor-cFT47-eUdew=s176-c-k-c0x00ffffff-no-nd-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
		{
			month: 11,
			songPlayed: 1,
			durationPlayed: 325,
			songListened: 1,
			durationListened: 325,
			mostPlayed: {
				videoId: "1knNptxvWVU",
				count: 1,
				video: {
					id: "1knNptxvWVU",
					title: "The Paper Kites - Red Light /lyrics/",
					duration: 325,
					thumbnails: [
						{
							url: "https://i.ytimg.com/vi/1knNptxvWVU/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCClbtH9zhWDZbcG9qowuQimGU8_w",
							width: 168,
							height: 94,
						},
						{
							url: "https://i.ytimg.com/vi/1knNptxvWVU/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLA_RKjzIfQqeBtupTWpmeW3p3D3IA",
							width: 196,
							height: 110,
						},
						{
							url: "https://i.ytimg.com/vi/1knNptxvWVU/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBMUWN85MqJ5S5FJZA8FY6TuKWZhA",
							width: 246,
							height: 138,
						},
						{
							url: "https://i.ytimg.com/vi/1knNptxvWVU/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAtxCy019qXMWqmU-rFUvrFrJmdyg",
							width: 336,
							height: 188,
						},
						{
							url: "https://i.ytimg.com/vi/1knNptxvWVU/maxresdefault.jpg",
							width: 1920,
							height: 1080,
						},
					],
					viewCount: 0,
					channel: {
						id: "UCcRtQYeKUMfFq3cwMqQwYPA",
						name: "Syuzanna Kazaryan / Сюзанна Казарян",
						thumbnails: [
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKabmo2ny6hgRG0bOJZedBK_hclB_IMylcOcq5g0ew=s48-c-k-c0x00ffffff-no-rj",
								width: 48,
								height: 48,
							},
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKabmo2ny6hgRG0bOJZedBK_hclB_IMylcOcq5g0ew=s88-c-k-c0x00ffffff-no-rj",
								width: 88,
								height: 88,
							},
							{
								url: "https://yt3.ggpht.com/ytc/APkrFKabmo2ny6hgRG0bOJZedBK_hclB_IMylcOcq5g0ew=s176-c-k-c0x00ffffff-no-rj",
								width: 176,
								height: 176,
							},
						],
					},
				},
			},
		},
	],
	durationPlayed: 2631525,
	songPlayed: 8612,
	uniqueSongPlayed: 355,
	durationListened: 3185283,
	songListened: 11165,
};

export type GetLastPlayedParams = {
	last: number;
} & GetVideosParams;

export type GetMostPlayedParams = {
	days: number;
	count: number;
} & GetVideosParams;

export type IRecap = {
	mostPlayed: MostPlayed[];
	monthly: Monthly[];
	durationPlayed: number;
	songPlayed: number;
	uniqueSongPlayed: number;
};

type Monthly = {
	month: number;
	songPlayed: number;
	durationPlayed: number;
	mostPlayed: MostPlayed;
};

type MostPlayed = {
	videoId: string;
	count: number;
	video: IVideoCompact;
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

	getRecap = async (): Promise<IRecap> => {
		return dummy;
	};
}
