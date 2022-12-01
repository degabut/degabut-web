import { Navigate } from "solid-app-router";
import { Component } from "solid-js";

export const Landing: Component = () => {
	return <Navigate href={"/app/queue"} />;
};
