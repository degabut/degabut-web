import { AppRoutes } from "@app/routes";
import { Button, Container, Icon, Input, Spinner, Text, useNavigate, useNotification } from "@common";
import { useSpotify } from "@spotify";
import { createSignal, onMount, Show, type Component } from "solid-js";

export const OAuthSpotify: Component = () => {
	const notification = useNotification();
	const spotify = useSpotify();
	const navigate = useNavigate();
	const [code, setCode] = createSignal<string | null>(null);

	const isActivityRedirect = location.hostname.endsWith("discordsays.com");

	onMount(async () => {
		if (isActivityRedirect) {
			const hashParams = new URLSearchParams(window.location.search);
			setCode(hashParams.get("code"));
		} else {
			try {
				await spotify.authenticate();
			} finally {
				navigate(AppRoutes.Spotify);
			}
		}
	});

	const copyCodeToClipboard = () => {
		navigator.clipboard.writeText(code() || "");
		notification.push({
			message: () => "Code copied to clipboard",
		});
	};

	return (
		<Container size="content" centered extraClass="flex items-center h-full">
			<Show keyed when={isActivityRedirect} fallback={<Spinner size="3xl" />}>
				<div class="flex-col-center sm:bg-neutral-900 bg-transparent sm:px-16 sm:py-24 rounded-2xl space-y-12">
					<div class="flex-row-center space-x-4">
						<Icon name="degabut" class="w-24 h-24 text-brand-500" />
						<Icon name="closeLine" class="w-4 h-4 text-neutral-700" />
						<Icon name="spotify" class="w-24 h-24 text-green-500" />
					</div>
					<div class="flex-row-center space-x-2">
						<Input
							outlined
							readonly
							contentEditable={false}
							value={code() || ""}
							type="password"
							suffix={() => (
								<Button flat icon="copy" class="p-2.5" onClick={() => copyCodeToClipboard()} />
							)}
						/>
					</div>
					<div class="flex flex-col space-y-2.5">
						<Text.Body1 class="max-w-64 text-center">
							Copy the code and paste it on your Discord application
						</Text.Body1>
						<Text.Caption2 class="max-w-64 text-center">
							You can close this window after pasting the code
						</Text.Caption2>
					</div>
				</div>
			</Show>
		</Container>
	);
};
