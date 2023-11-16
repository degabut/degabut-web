import { useContext } from "solid-js";
import { DesktopContext } from "../providers";

export const useDesktop = () => useContext(DesktopContext);
