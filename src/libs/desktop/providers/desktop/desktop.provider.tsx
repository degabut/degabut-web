import { IS_BROWSER } from "@constants";
import { createContext, ParentComponent } from "solid-js";
import { useRichPresence, useRPC } from "./hooks";

type DesktopContext = ReturnType<typeof useRPC>;

export const DesktopContext = createContext<DesktopContext>({
	authenticateRpc: () => {},
	setBotVolume: () => {},
});

export const DesktopProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (IS_BROWSER) return <>{props.children}</>;

	const rpc = useRPC();
	useRichPresence();

	return <DesktopContext.Provider value={{ ...rpc }}>{props.children}</DesktopContext.Provider>;
};
