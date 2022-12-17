import { Text } from "@components/Text";
import { useApi } from "@hooks/useApi";
import { useNavigate, useParams } from "@solidjs/router";
import { Component, onMount } from "solid-js";

export const Join: Component = () => {
	const api = useApi();
	const navigate = useNavigate();
	const params = useParams<{ id: string }>();

	onMount(async () => {
		await api.player.join(params.id);
		navigate("/");
	});

	return (
		<div class="flex-row-center justify-center h-full">
			<Text.H2 class="text-xl">Loading...</Text.H2>
		</div>
	);
};
