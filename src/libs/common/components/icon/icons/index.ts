import Degabut from "~icons/degabut/degabut";
import DegabutThin from "~icons/degabut/degabut-thin";
import ArrowDown from "~icons/mdi/arrow-down";
import ArrowUp from "~icons/mdi/arrow-up";
import ChevronDown from "~icons/mdi/chevron-down";
import ChevronRight from "~icons/mdi/chevron-right";
import Close from "~icons/mdi/close";
import Copy from "~icons/mdi/content-copy";
import Dot from "~icons/mdi/dot";
import EditPencil from "~icons/mdi/edit";
import Ellipsis from "~icons/mdi/ellipsis-vertical";
import EqualizerVertical from "~icons/mdi/equalizer-vertical";
import Error from "~icons/mdi/error";
import LinkExternal from "~icons/mdi/external-link";
import List from "~icons/mdi/format-list-bulleted-square";
import Gear from "~icons/mdi/gear";
import GearPlay from "~icons/mdi/gear-play";
import Menu from "~icons/mdi/hamburger-menu";
import Heart from "~icons/mdi/heart";
import HeartBroken from "~icons/mdi/heart-broken";
import HeartLine from "~icons/mdi/heart-outline";
import LibraryMusic from "~icons/mdi/library-music";
import LibraryMusicLine from "~icons/mdi/library-music-outline";
import Link from "~icons/mdi/link-variant";
import Microphone from "~icons/mdi/microphone-variant";
import Music from "~icons/mdi/music";
import Pause from "~icons/mdi/pause";
import People from "~icons/mdi/people";
import Play from "~icons/mdi/play";
import PlaylistMusic from "~icons/mdi/playlist-music";
import PlaylistMusicLine from "~icons/mdi/playlist-music-outline";
import PlaylistPlay from "~icons/mdi/playlist-play";
import PlaylistPlus from "~icons/mdi/playlist-plus";
import PlaylistRemove from "~icons/mdi/playlist-remove";
import Plus from "~icons/mdi/plus";
import Reload from "~icons/mdi/reload";
import Reorder from "~icons/mdi/reorder-horizontal";
import Loop from "~icons/mdi/repeat";
import LoopOne from "~icons/mdi/repeat-once";
import Search from "~icons/mdi/search";
import Shuffle from "~icons/mdi/shuffle-variant";
import SkipNext from "~icons/mdi/skip-next";
import SkipPrevious from "~icons/mdi/skip-previous";
import Spotify from "~icons/mdi/spotify";
import Stars from "~icons/mdi/stars";
import StarsLine from "~icons/mdi/stars-outline";
import Swap from "~icons/mdi/swap-horizontal";
import TrashBin from "~icons/mdi/trash-can-outline";
import Download from "~icons/mdi/tray-download";
import SoundFull from "~icons/mdi/volume-high";
import SoundMedium from "~icons/mdi/volume-medium";
import SoundOff from "~icons/mdi/volume-mute";
import Youtube from "~icons/mdi/youtube";

export const icons = {
	arrowDown: { component: ArrowDown },
	arrowUp: { component: ArrowUp },
	chevronDown: { component: ChevronDown, viewBox: "5 5 14 14" },
	chevronRight: { component: ChevronRight, viewBox: "5 5 14 14" },
	closeLine: { component: Close, viewBox: "5 5 14 14" },
	copy: { component: Copy, viewBox: "1 1 22 22" },
	degabutThin: { component: Degabut, viewBox: "0 0 1024 1024" },
	degabut: { component: DegabutThin, viewBox: "0 0 1024 1024" },
	download: { component: Download },
	dot: { component: Dot },
	editPencil: { component: EditPencil },
	ellipsis: { component: Ellipsis, viewBox: "4 4 16 16" },
	error: { component: Error },
	equalizer: { component: EqualizerVertical },
	skipNext: { component: SkipNext, viewBox: "5 5 14 14" },
	skipPrevious: { component: SkipPrevious, viewBox: "5 5 14 14" },
	gear: { component: Gear },
	gearPlay: { component: GearPlay },
	heartBroken: { component: HeartBroken },
	heartLine: { component: HeartLine },
	heart: { component: Heart },
	libraryMusic: { component: LibraryMusic },
	libraryMusicLine: { component: LibraryMusicLine },
	linkExternal: { component: LinkExternal },
	link: { component: Link },
	list: { component: List },
	loopOne: { component: LoopOne },
	loop: { component: Loop },
	menu: { component: Menu },
	microphone: { component: Microphone },
	musicNotes: { component: Music },
	pause: { component: Pause, viewBox: "5 5 14 14" },
	people: { component: People },
	play: { component: Play, viewBox: "6 5 14 14" },
	playlistMusic: { component: PlaylistMusic },
	playlistMusicLine: { component: PlaylistMusicLine },
	playlistPlus: { component: PlaylistPlus },
	playlistPlay: { component: PlaylistPlay },
	playlistRemove: { component: PlaylistRemove },
	plus: { component: Plus, viewBox: "5 5 14 14" },
	reload: { component: Reload },
	search: { component: Search, viewBox: "3 3 18 18" },
	shuffle: { component: Shuffle },
	reorder: { component: Reorder },
	soundFull: { component: SoundFull, viewBox: "3 3 18 18" },
	soundMedium: { component: SoundMedium, viewBox: "3 3 18 18" },
	soundOff: { component: SoundOff, viewBox: "3 3 18 18" },
	spotify: { component: Spotify },
	stars: { component: Stars, viewBox: "1 1 22 22" },
	starsLine: { component: StarsLine, viewBox: "1 1 22 22" },
	swap: { component: Swap, viewBox: "3 3 18 18" },
	trashBin: { component: TrashBin, viewBox: "3 3 18 18" },
	youtube: { component: Youtube },
} as const;
