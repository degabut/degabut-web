import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";

export const App: Component = () => {
	return <ProvidedApp />;
};

const ProvidedApp: Component = () => {
	return <Outlet />;
};
