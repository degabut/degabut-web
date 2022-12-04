import { SettingsContext } from "@providers/SettingsProvider";
import { useContext } from "solid-js";

export const useSettings = () => useContext(SettingsContext);
