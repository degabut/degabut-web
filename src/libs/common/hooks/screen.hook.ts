import { ScreenContext } from "@common/providers";
import { useContext } from "solid-js";

export const useScreen = () => useContext(ScreenContext);
