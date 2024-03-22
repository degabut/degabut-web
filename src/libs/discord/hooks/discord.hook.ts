import { useContext } from "solid-js";
import { DiscordContext } from "../providers";

export const useDiscord = () => useContext(DiscordContext);
