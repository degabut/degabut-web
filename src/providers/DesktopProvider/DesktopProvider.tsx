import { IS_BROWSER } from "@constants";
import { createContext, ParentComponent } from "solid-js";
import { useDiscordRPC, useSettingsWatcher } from "./hooks";

export const DesktopContext = createContext();

export const DesktopProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (IS_BROWSER) return <>{props.children}</>;

	useDiscordRPC();
	useSettingsWatcher();

	return <DesktopContext.Provider value={{}}>{props.children}</DesktopContext.Provider>;
};
