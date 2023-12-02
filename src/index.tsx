/* @refresh reload */
import { Root } from "@root/views";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "./font.css";
import "./index.css";

render(
	() => (
		<Router>
			<Root />
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
