import { useApi } from "@hooks/useApi";
import { useNavigate, useParams } from "solid-app-router";
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
			<div class="text-xl">Loading...</div>
		</div>
	);
};
