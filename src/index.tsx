/* @refresh reload */
import { ApiProvider } from "@providers/ApiProvider";
import { ContextMenuProvider } from "@providers/ContextMenuProvider";
import { NotificationProvider } from "@providers/NotificationProvider";
import { ScreenProvider } from "@providers/ScreenProvider";
import { Router } from "@solidjs/router";
import { Main } from "@views/Main";
import { render } from "solid-js/web";
import "./index.css";

render(
	() => (
		<Router>
			<ScreenProvider>
				<ContextMenuProvider>
					<NotificationProvider>
						<ApiProvider>
							<Main />
						</ApiProvider>
					</NotificationProvider>
				</ContextMenuProvider>
			</ScreenProvider>
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
