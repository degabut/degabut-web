import { useContext } from "solid-js";
import { AppContext } from "../providers";

export const useApp = () => useContext(AppContext);
