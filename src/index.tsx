/* @refresh reload */
import { ApiProvider } from "@providers/ApiProvider";
import { ScreenProvider } from "@providers/ScreenProvider";
import { Main } from "@views/Main";
import { Router } from "solid-app-router";
import { render } from "solid-js/web";
import "./index.css";

render(
	() => (
		<Router>
			<ScreenProvider>
				<ApiProvider>
					<Main />
				</ApiProvider>
			</ScreenProvider>
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
