import { useApp } from "@app/hooks";
import { AppRoutes } from "@app/routes";
import { Item, SectionList, Text, useNavigate } from "@common";
import { useQueue } from "@queue";
import { SpotifyAlbum, SpotifyContextMenuUtil, SpotifyPlaylist, useSpotify } from "@spotify";
import { createMemo, type Component } from "solid-js";
import { RefreshButton } from "./refresh-button.component";

export const Library: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const spotify = useSpotify();
	const navigate = useNavigate();

	const isLoading = createMemo(() => {
		return spotify.playlists.data.loading || spotify.albums.data.loading;
	});

	const refresh = () => {
		spotify.albums.refetch();
		spotify.playlists.refetch();
	};

	return (
		<SectionList
			label="Library"
			items={[...(spotify.albums.data() || []), ...(spotify.playlists.data() || [])]}
			skeletonCount={5}
			isLoading={isLoading()}
			rightTitle={() => <RefreshButton disabled={isLoading()} onClick={refresh} />}
			firstElement={() => (
				<Item.Hint
					label={() => <Text.Body1 truncate>Liked Tracks</Text.Body1>}
					icon="heartLine"
					onClick={() => navigate(AppRoutes.SpotifyLiked)}
				/>
			)}
		>
			{(item) =>
				item.type === "playlist" ? (
					<SpotifyPlaylist.List
						onClick={() => navigate(AppRoutes.SpotifyPlaylist, { params: { id: item.id } })}
						playlist={item}
						contextMenu={SpotifyContextMenuUtil.getPlaylistContextMenu({
							playlist: item,
							queueStore: queue,
							appStore: app,
						})}
					/>
				) : (
					<SpotifyAlbum.List
						onClick={() => navigate(AppRoutes.SpotifyAlbum, { params: { id: item.id } })}
						album={item}
						contextMenu={SpotifyContextMenuUtil.getAlbumContextMenu({
							album: item,
							queueStore: queue,
							appStore: app,
						})}
					/>
				)
			}
		</SectionList>
	);
};
