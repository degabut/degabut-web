import { Text } from "@common";
import type { IRichPresencePlaceholder } from "@discord";
import { For, type Component } from "solid-js";

type PlaceholdersTableProps = {
	placeholders: Partial<IRichPresencePlaceholder>;
};

export const PlaceholdersTable: Component<PlaceholdersTableProps> = (props) => {
	return (
		<div class="space-y-2">
			<Text.H3>Placeholders</Text.H3>

			<table>
				<tbody>
					<For each={Object.entries(props.placeholders)}>
						{([key, description]) => (
							<tr>
								<td class="pr-4">
									<code>&#123;{key}&#125;</code>
								</td>
								<td>{description}</td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
};
