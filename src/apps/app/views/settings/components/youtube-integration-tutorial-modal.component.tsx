import { A, Divider, Modal, Text } from "@common";
import type { Component } from "solid-js";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export const YouTubeIntegrationTutorialModal: Component<Props> = (props) => {
	return (
		<Modal
			isOpen={props.isOpen}
			handleClose={props.onClose}
			extraContainerClass="w-2xl h-[90vh] md:h-[70vh]"
			closeOnEscape
		>
			<div class="flex flex-col h-full">
				<div class="py-4 pb-0!">
					<Text.H2 class="text-center mb-4">YouTube Integration</Text.H2>
					<Divider />
				</div>
				<div class="pb-8 pt-4 px-4 md:px-8 overflow-y-auto space-y-6">
					<ol class="list-decimal list-inside space-y-4">
						<li>
							Login to{" "}
							<A
								class="underline underline-offset-2 select-text"
								target="_blank"
								href="https://console.cloud.google.com"
							>
								console.cloud.google.com
							</A>{" "}
							with your Google account
						</li>

						<li>
							<span>
								<A
									class="underline underline-offset-2 select-text"
									target="_blank"
									href="https://console.cloud.google.com/projectcreate"
								>
									Create a new project
								</A>{" "}
								(or select an existing one) from the project dropdown on the top left of the page (you
								can put any name for the new project)
							</span>
							<img src="/img/youtube-tutorial/new-project.jpg" alt="Google Cloud Project Selector" />
						</li>

						<li>
							<A
								class="underline underline-offset-2 select-text"
								target="_blank"
								href="https://console.cloud.google.com/auth/overview/create"
							>
								Set up project configuration
							</A>
							; fill in app information (you can put any for the name), and set Audience to{" "}
							<code>External</code> (make sure that the correct project is selected from the project
							dropdown on the top left of the page.)
						</li>

						<li>
							<A
								class="underline underline-offset-2 select-text"
								target="_blank"
								href="https://console.cloud.google.com/auth/audience"
							>
								Add your YouTube email address as a test user
							</A>
							; press the <code>Add users</code> button on the <code>Test users</code> section, and put
							your YouTube email address there.
						</li>

						<li>
							<A
								class="underline underline-offset-2 select-text"
								target="_blank"
								href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
							>
								Enable the YouTube Data API v3
							</A>
						</li>

						<li>
							<A
								class="underline underline-offset-2 select-text"
								target="_blank"
								href="https://console.cloud.google.com/auth/clients/create"
							>
								Create an OAuth client
							</A>
							, choose <code>Web application</code> as the application type and put{" "}
							<code class="select-text text-brand">{window.location.origin}/oauth/youtube</code> in the{" "}
							<code>Authorized redirect URIs</code>, store the <code>Client ID</code> and{" "}
							<code>Client Secret</code> safely after creation.
							<img src="/img/youtube-tutorial/create-oauth-client.jpg" alt="Authorized Redirect URIs" />
						</li>

						<li>
							Put the Client ID on the <b>YouTube Client ID</b> field and the Client Secret on the{" "}
							<b>YouTube Client Secret</b> field on the settings page, then click the{" "}
							<code>Authenticate</code> button (you may press <code>Continue</code> when being warned
						</li>

						<li>
							If you see a "Google hasn't verified this app" warning, click <code>Continue</code>. This is
							expected for personal apps
						</li>
					</ol>

					<Divider dark />

					<div>
						Notes:
						<ul class="list-disc list-inside space-y-2">
							<li>
								Your Client ID and Client Secret are stored locally, if you want to use YouTube
								integration on another device with the same Degabut account, you need to put the same
								Client ID and Secret on the settings page on that device and authenticate it
							</li>
							<li>
								API usage is limited by the daily quota of your Google Cloud project (10,000 units/day
								by default). Reading playlists is cheap (1 unit), adding / removing a video from a
								playlist costs 50 units. You may check your quota usage{" "}
								<A
									class="underline underline-offset-2 select-text"
									target="_blank"
									href="https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas"
								>
									here
								</A>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</Modal>
	);
};
