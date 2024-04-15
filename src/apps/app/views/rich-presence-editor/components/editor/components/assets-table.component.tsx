import { Text } from "@common";
import type { IRichPresenceAsset } from "@discord";
import { For, type Component } from "solid-js";

type AssetTableProps = {
	assets: IRichPresenceAsset[];
};

export const AssetsTable: Component<AssetTableProps> = (props) => {
	return (
		<div class="space-y-2">
			<Text.H3>Asset Keys</Text.H3>

			<div class="grid grid-cols-2 gap-y-2 gap-x-8">
				<For each={props.assets}>
					{(asset) => (
						<div class="flex flex-row items-center space-x-2">
							<img class="w-6 h-6 object-cover" src={asset.url} />
							<Text.Body2>{asset.name}</Text.Body2>
						</div>
					)}
				</For>
			</div>
		</div>
	);
};
