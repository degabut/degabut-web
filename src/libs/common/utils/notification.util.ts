export class NotificationUtil {
	static async notify(title: string, options?: NotificationOptions): Promise<Notification | undefined> {
		if (!("Notification" in window) || Notification.permission === "denied") return;

		if (Notification.permission !== "granted") {
			const permission = await Notification.requestPermission();
			if (permission !== "granted") return;
		}

		return new Notification(title, options);
	}

	static async requestPermission(): Promise<NotificationPermission | undefined> {
		if (!("Notification" in window) || Notification.permission === "denied") return;
		const permission = await Notification.requestPermission();
		return permission;
	}
}
