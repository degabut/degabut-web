import { AppRoutes } from "@app/routes";
import { Container, Spinner, useNavigate } from "@common";
import { useSpotify } from "@spotify";
import { onMount, type Component } from "solid-js";

export const OAuthSpotify: Component = () => {
	const spotify = useSpotify();
	const navigate = useNavigate();

	onMount(async () => {
		try {
			await spotify.authenticate();
		} finally {
			navigate(AppRoutes.Spotify);
		}
	});

	return (
		<Container size="content" centered extraClass="flex items-center h-full">
			<Spinner size="3xl" />
		</Container>
	);
};
