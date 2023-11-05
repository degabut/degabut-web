import { ApiContext } from "@common/providers";
import { useContext } from "solid-js";

export const useApi = () => useContext(ApiContext);
