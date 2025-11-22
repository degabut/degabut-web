import { Button, Divider, Input, Modal, Text } from "@common";
import { createEffect, createSignal, type Component } from "solid-js";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onAuthenticate: (code: string) => void;
};

export const SpotifyCodePromptModal: Component<Props> = (props) => {
	const [code, setCode] = createSignal("");
	const [isAuthenticating, setIsAuthenticating] = createSignal(false);

	const onAuthenticate = async () => {
		setIsAuthenticating(true);
		if (code()) props.onAuthenticate(code());
	};

	createEffect(() => {
		if (!props.isOpen) setIsAuthenticating(false);
	});

	return (
		<Modal
			isOpen={props.isOpen}
			handleClose={props.onClose}
			extraContainerClass="w-[24rem] max-h-[90vh]"
			closeOnEscape
		>
			<div class="flex flex-col h-full">
				<div class="py-4 !pb-0">
					<Text.H2 class="text-center mb-4">Spotify Code</Text.H2>
					<Divider />
				</div>
				<div class="flex-col-center space-y-4 pb-8 pt-4 px-4 md:px-8 overflow-y-auto">
					<Text.Body1 class="text-center">
						A new page for Spotify authentication has opened in your browser.
					</Text.Body1>
					<Text.Caption1 class="text-center">Put the code found in the page here</Text.Caption1>
					<Input
						value={code()}
						onInput={(e) => setCode(e.target.value)}
						disabled={isAuthenticating()}
						outlined
						class="w-full"
						type="password"
						placeholder="Paste code here"
					/>
					<Button class="px-4 py-2" onClick={onAuthenticate} disabled={isAuthenticating() || !code().trim()}>
						{isAuthenticating() ? "Authenticating..." : "Authenticate"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
