import { Divider } from "@components/Divider";
import { Drawer } from "@components/Drawer";
import { Icon } from "@components/Icon";
import { useApp } from "@hooks/useApp";
import { useScreen } from "@hooks/useScreen";
import { Component } from "solid-js";
import { Link } from "./Link";
import { NowPlaying } from "./NowPlaying";

const MusicNoteIcon: Component<{ extraClass: string }> = (props) => (
	<Icon name="musicNote" extraClass={`w-24 h-24 fill-white/10 pointer-events-none ${props.extraClass}`} />
);

export const AppDrawer: Component = () => {
	const app = useApp();
	const screen = useScreen();

	const onLinkClick = () => {
		if (screen().lte.sm) app.setIsMenuOpen(false);
	};

	return (
		<Drawer isOpen={app.isMenuOpen()} handleClose={() => app.setIsMenuOpen(false)}>
			<MusicNoteIcon extraClass="absolute top-0 left-2" />

			<div class="px-6 font-brand font-semibold text-3xl truncate py-8">degabut</div>

			<div class="flex-grow text-lg space-y-1.5 mx-2">
				<Link icon="degabutThin" label="Queue" path="/app/queue" onClick={onLinkClick} />
				<Link icon="search" label="Search" path="/app/search" onClick={onLinkClick} />
				<Link icon="audioPlaylist" label="Playlist" path="/app/u/me/playlists" onClick={onLinkClick} />
				<Link icon="heart" label="For You" path="/app/u/me/videos" onClick={onLinkClick} />
			</div>

			<div class="space-y-2 pb-8 mx-2">
				<NowPlaying />
				<Divider dark extraClass="hidden md:block" />
				<Link icon="gear" label="Settings" path="/app/settings" variant="small" onClick={onLinkClick} />
			</div>
		</Drawer>
	);
};
