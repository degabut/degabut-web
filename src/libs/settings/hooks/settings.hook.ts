import { useContext } from "solid-js";
import { SettingsContext } from "../providers";

export const useSettings = () => useContext(SettingsContext);
