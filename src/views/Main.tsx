import { Landing, Login, OAuth } from "@views";
import { RootApp } from "@views/App/App";
import { PlaylistDetail, Playlists } from "@views/App/Playlist";
import { Queue } from "@views/App/Queue";
import { Recommendation } from "@views/App/Recommendation";
import { Search } from "@views/App/Search";
import { Settings } from "@views/App/Settings";
import { VideoDetail } from "@views/App/VideoDetail";
import { Route, Routes } from "solid-app-router";
import { Component } from "solid-js";

export const Main: Component = () => {
	return (
		<>
			<div class="flex flex-col h-full">
				<div class="flex-grow overflow-x-auto overflow-y-auto w-full">
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/login" element={<Login />} />
						<Route path="/oauth" element={<OAuth />} />
						<Route path="/app" element={<RootApp />}>
							<Route path="/" element={<Queue />} />
							<Route path="/queue" element={<Queue />} />
							<Route path="/video/:id" element={<VideoDetail />} />
							<Route path="/u/:id/videos" element={<Recommendation />} />
							<Route path="/u/me/playlists" element={<Playlists />} />
							<Route path="/u/me/playlists/:id" element={<PlaylistDetail />} />
							<Route path="/search" element={<Search />} />
							<Route path="/settings" element={<Settings />} />
						</Route>
					</Routes>
				</div>
			</div>
		</>
	);
};
