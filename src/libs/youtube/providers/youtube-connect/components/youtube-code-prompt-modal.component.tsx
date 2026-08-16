import { Button, Divider, Input, Modal, Text } from "@common";
import { Show, createEffect, createSignal, type Component } from "solid-js";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onAuthenticate: (code: string) => void | Promise<void>;
};

export const YouTubeCodePromptModal: Component<Props> = (props) => {
	const [code, setCode] = createSignal("");
	const [isAuthenticating, setIsAuthenticating] = createSignal(false);
	const [error, setError] = createSignal("");

	const onAuthenticate = async () => {
		setIsAuthenticating(true);
		setError("");
		try {
			if (code()) await props.onAuthenticate(code());
		} catch (e) {
			setError(e instanceof Error ? e.message : "Authentication failed");
		} finally {
			setIsAuthenticating(false);
		}
	};

	createEffect(() => {
		if (!props.isOpen) {
			setIsAuthenticating(false);
			setError("");
		}
	});

	return (
		<Modal
			isOpen={props.isOpen}
			handleClose={props.onClose}
			extraContainerClass="w-[24rem] max-h-[90vh]"
			closeOnEscape
		>
			<div class="flex flex-col h-full">
				<div class="py-4 pb-0!">
					<Text.H2 class="text-center mb-4">YouTube Code</Text.H2>
					<Divider />
				</div>
				<div class="flex-col-center space-y-4 pb-8 pt-4 px-4 md:px-8 overflow-y-auto">
					<Text.Body1 class="text-center">
						A new page for YouTube authentication has opened in your browser.
					</Text.Body1>
					<Text.Caption1 class="text-center">
						After signing in, you'll be redirected to a page that shows the authorization code. Copy the{" "}
						<b>code</b> and paste it here
					</Text.Caption1>
					<Input
						value={code()}
						onInput={(e) => setCode(e.target.value)}
						disabled={isAuthenticating()}
						outlined
						class="w-full"
						placeholder="Paste code here"
					/>
					<Show when={error()}>
						<Text.Caption1 class="text-red-600 text-center">{error()}</Text.Caption1>
					</Show>
					<Button class="px-4 py-2" onClick={onAuthenticate} disabled={isAuthenticating() || !code().trim()}>
						{isAuthenticating() ? "Authenticating..." : "Authenticate"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
