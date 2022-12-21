import { AppContext } from "@providers/AppProvider";
import { useContext } from "solid-js";

export const useApp = () => useContext(AppContext);
