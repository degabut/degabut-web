import { createSignal, type Accessor, type JSX, type Setter } from "solid-js";

export type NotificationContent = JSX.Element | Accessor<JSX.Element>;
type ContentState = { value: NotificationContent };

export class PersistentNotification {
	readonly id: string;

	readonly message: Accessor<JSX.Element>;

	readonly isVisible: Accessor<boolean>;

	private setContent: Setter<ContentState | null>;
	private setVisible: Setter<boolean>;
	private onDestroy: (notification: PersistentNotification) => void;
	private isDestroyed = false;

	constructor(onDestroy: (notification: PersistentNotification) => void) {
		const [content, setContent] = createSignal<ContentState | null>(null);
		const [isVisible, setVisible] = createSignal(false);

		this.id = crypto.randomUUID();
		this.message = () => {
			const value = content()?.value;
			if (typeof value === "function") return value();
			return value ?? null;
		};
		this.isVisible = isVisible;
		this.setContent = setContent;
		this.setVisible = setVisible;
		this.onDestroy = onDestroy;
	}

	setJsx = (jsx: NotificationContent) => {
		this.setContent({ value: jsx });
	};

	show = () => this.setVisible(true);

	destroy = () => {
		if (this.isDestroyed) return;
		this.isDestroyed = true;
		this.onDestroy(this);
	};
}
