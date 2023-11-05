import { SettingsContext } from "@settings/providers";
import { useContext } from "solid-js";

export const useSettings = () => useContext(SettingsContext);
