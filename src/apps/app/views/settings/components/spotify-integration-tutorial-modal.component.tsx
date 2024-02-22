import { A, Divider, Modal, Text } from "@common/components";
import { Component } from "solid-js";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export const SpotifyIntegrationTutorialModal: Component<Props> = (props) => {
	return (
		<Modal
			isOpen={props.isOpen}
			onClickOutside={props.onClose}
			extraContainerClass="w-[42rem] top-[15vh] h-[90vh] md:h-[70vh]"
			closeOnEscape
		>
			<div class="flex flex-col h-full">
				<div class="py-4 !pb-0">
					<Text.H2 class="text-center mb-4">Spotify Integration</Text.H2>
					<Divider />
				</div>
				<div class="pb-8 pt-4 px-4 md:px-8 overflow-y-auto">
					<ol class="list-decimal list-inside space-y-6">
						<li class="space-y-2">
							<span>
								Login to{" "}
								<A
									class="underline underline-offset-2 select-text"
									target="_blank"
									href="https://developer.spotify.com"
								>
									developer.spotify.com
								</A>{" "}
								with your Spotify account
							</span>
							<img src="/img/spotify-tutorial/login.png" class="w-full" />
						</li>

						<li class="space-y-2">
							<span>
								Go to the <A href="https://developer.spotify.com/dashboard">Dashboard page</A> by
								clicking on your profile icon on the top right of the page, then click{" "}
								<code>Dashboard</code>
							</span>
							<img src="/img/spotify-tutorial/dashboard.png" class="w-full" />
						</li>

						<li class="space-y-2">
							<span>
								Click the <code>Create app</code> button on the dashboard page
							</span>
							<img src="/img/spotify-tutorial/create-app.png" class="w-full" />
						</li>

						<li>
							Fill in the app name and description with whatever you want (for example{" "}
							<code>Degabut Spotify</code>)
						</li>

						<li>
							Put <code class="select-text text-brand">{window.location.origin}/oauth/spotify</code> for
							the Redirect URI.
						</li>

						<li class="space-y-2">
							<span>
								Check the box for agreeing with the terms of service and click the <code>Save</code>{" "}
								button
							</span>
							<img src="/img/spotify-tutorial/create-app-details.png" class="w-full" />
						</li>

						<li class="space-y-2">
							<span>
								On the app page, click the <code>Settings</code> button
							</span>
							<img src="/img/spotify-tutorial/settings.png" class="w-full" />
						</li>

						<li class="space-y-2">
							<span>Copy the Client ID value</span>
							<img src="/img/spotify-tutorial/client-id.png" class="w-full" />
						</li>

						<li class="space-y-2">
							<span>
								Paste the Client ID on the Spotify Client ID field on the settings page, and click the{" "}
								<code>Authenticate</code> button
							</span>
							<img src="/img/spotify-tutorial/client-id-authenticate.png" class="w-full" />
						</li>

						<li>
							Follow the authentication process by clicking the <code>Agree</code> button, and Spotify
							integration should be ready to use!
						</li>
					</ol>

					<Divider dark extraClass="my-6" />

					<div>
						Notes:
						<ul class="list-disc list-inside space-y-2">
							<li>
								Your Client ID is stored locally, if you want to use Spotify integration on another
								device with the same Degabut account, you need to put the same Client ID on the settings
								page on that device and authenticate it
							</li>
							<li>
								You can't share your Client ID to be used with another Spotify account, only your
								Spotify account can use the Client ID that you made. To let other Spotify users use it,
								you can invite them to your Spotify app from the <code>User Management</code> page
							</li>
						</ul>
					</div>
				</div>
			</div>
		</Modal>
	);
};
