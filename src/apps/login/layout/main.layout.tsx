import { DesktopContainer } from "@desktop";
import type { ParentComponent } from "solid-js";

export const Main: ParentComponent = (props) => {
	return <DesktopContainer>{props.children}</DesktopContainer>;
};
