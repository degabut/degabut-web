/* @refresh reload */
import { routes } from "@root/routes";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "./index.css";

render(() => <Router>{routes}</Router>, document.getElementById("root") as HTMLElement);
