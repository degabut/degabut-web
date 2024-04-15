import { useContext } from "solid-js";
import { SpotifyContext } from "../providers";

export const useSpotify = () => useContext(SpotifyContext);
