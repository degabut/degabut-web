import { QueueProvider } from "@queue/providers";
import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";

export const App: Component = () => {
	return (
		<QueueProvider>
			<ProvidedApp />
		</QueueProvider>
	);
};

const ProvidedApp: Component = () => {
	return <Outlet />;
};
