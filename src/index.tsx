/* @refresh reload */
import { ApiProvider } from "@providers/ApiProvider";
import { ContextMenuProvider } from "@providers/ContextMenuProvider";
import { ScreenProvider } from "@providers/ScreenProvider";
import { Main } from "@views/Main";
import { Router } from "solid-app-router";
import { render } from "solid-js/web";
import "./index.css";

render(
	() => (
		<Router>
			<ScreenProvider>
				<ContextMenuProvider>
					<ApiProvider>
						<Main />
					</ApiProvider>
				</ContextMenuProvider>
			</ScreenProvider>
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
