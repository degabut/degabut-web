import { NotificationContext } from "@common/providers";
import { useContext } from "solid-js";

export const useNotification = () => useContext(NotificationContext);
