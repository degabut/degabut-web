import { BotSelectorContext } from "@providers/BotSelectorProvider";
import { useContext } from "solid-js";

export const useBotSelector = () => useContext(BotSelectorContext);
