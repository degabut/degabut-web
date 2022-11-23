import { useNavigate } from "solid-app-router";
import { Component, onMount } from "solid-js";

export const Landing: Component = () => {
	const navigate = useNavigate();

	onMount(() => navigate("/app/queue"));

	return <></>;
};
