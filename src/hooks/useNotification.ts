import { NotificationContext } from "@providers/NotificationProvider";
import { useContext } from "solid-js";

export const useNotification = () => useContext(NotificationContext);
