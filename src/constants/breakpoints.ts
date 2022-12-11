export const breakpoints = {
	"3xl": 2048,
	"2xl": 1536,
	xl: 1280,
	lg: 1024,
	md: 768,
	sm: 640,
	xs: 0,
} as const;

export const breakpointKeys = Object.keys(breakpoints) as (keyof typeof breakpoints)[];

export type BreakpointKeys = keyof typeof breakpoints;
