module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		extend: {
			screens: {
				"3xl": "2048px",
			},
			maxWidth: {
				"8xl": "1408px",
			},
			colors: {
				brand: {
					DEFAULT: "#ECE350",
					50: "#FEFDF6",
					100: "#FCFBE3",
					200: "#F8F5BE",
					300: "#F4EF9A",
					400: "#F0E975",
					500: "#ECE350",
					600: "#E7DB1D",
					700: "#B8AE14",
					800: "#857E0E",
					900: "#534E09",
				},
				neutral: {
					850: "#1e1e1e",
					950: "#101010",
				},
			},
		},
	},
	plugins: [require("@tailwindcss/line-clamp")],
};
