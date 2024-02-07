import { useNavigate } from "@solidjs/router";
import { useSpotify } from "@spotify/hooks";
import { Component, onMount } from "solid-js";

export const OAuthSpotify: Component = () => {
	const spotify = useSpotify();
	const navigate = useNavigate();

	onMount(async () => {
		try {
			await spotify.authenticate();
		} catch (err) {
			/* */
			console.error(err);
		}
		navigate("/spotify");
	});

	return <></>;
};
