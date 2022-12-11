/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ParentComponent } from "solid-js";
import { defaultScreenValue, Screen, useScreen } from "./hooks";

export const ScreenContext = createContext<Screen>(defaultScreenValue);

export const ScreenProvider: ParentComponent = (props) => {
	const screen = useScreen();

	return <ScreenContext.Provider value={screen}>{props.children}</ScreenContext.Provider>;
};
