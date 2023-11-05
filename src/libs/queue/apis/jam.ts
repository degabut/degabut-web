import { IGuildMember } from "./queue";

export interface IJamCollection {
	member: IGuildMember;
	jams: IJam[];
}

export interface IJam {
	xOffset: number;
	ySpeed: number;
	jamSpeed: number;
}
