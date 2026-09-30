import { IMember } from "../apis";

export class MemberUtil {
	public static isActive(member: IMember): boolean {
		// 2 minutes on backend, 5 minutes on frontend
		return member.isInVoiceChannel || (member.isLink && Date.now() - member.lastPingTimestamp < 300 * 1000);
	}
}
