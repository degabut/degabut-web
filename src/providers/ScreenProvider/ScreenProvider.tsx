/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accessor, createContext, ParentComponent } from "solid-js";
import { defaultScreenValue, Screen, useScreen } from "./hooks";

type ScreenContextStore = Accessor<Screen>;

export const ScreenContext = createContext<ScreenContextStore>(() => defaultScreenValue);

export const ScreenProvider: ParentComponent = (props) => {
	const screen = useScreen();

	return <ScreenContext.Provider value={screen}>{props.children}</ScreenContext.Provider>;
};
