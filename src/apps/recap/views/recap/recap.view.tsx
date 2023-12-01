import { useParams } from "@solidjs/router";
import { IRecap } from "@user/apis";
import { useRecap } from "@user/hooks";
import { Component, For, Show } from "solid-js";
import { Section } from "../../components";
import {
	ActivitySection,
	FavoriteSection,
	MonthlyActivitySection,
	OverviewSection,
	QuarterRecapSection,
	TitleSection,
	TopSongsSection,
} from "./components";

export const Recap: Component = () => {
	const params = useParams<{ year: string }>();
	const yearParam = () => {
		if (!params.year) return new Date().getFullYear();
		const year = +params.year;
		if (year < 2000 || year > new Date().getFullYear()) return new Date().getFullYear();
		return year;
	};
	const recap = useRecap({ year: yearParam() });

	const sections = [
		{
			id: "title",
			component: () => <TitleSection year={yearParam()} />,
		},
		{
			id: "activity",
			title: "Your Activity",
			component: (recap: IRecap) => <ActivitySection recap={recap} />,
		},
		{
			id: "favorite",
			title: "Your Favorite Song",
			component: (recap: IRecap) => <FavoriteSection recap={recap} />,
		},
		{
			id: "topSongs",
			title: "Top Songs",
			component: (recap: IRecap) => <TopSongsSection recap={recap} />,
		},
		{
			id: "monthly",
			title: "Your Monthly Activities",
			component: (recap: IRecap) => <MonthlyActivitySection recap={recap} />,
		},
		{
			id: "q1",
			title: "Your Q1 Recap",
			component: (recap: IRecap) => <QuarterRecapSection recap={recap} quarter={1} />,
		},
		{
			id: "q2",
			title: "Your Q2 Recap",
			component: (recap: IRecap) => <QuarterRecapSection recap={recap} quarter={2} />,
		},
		{
			id: "q3",
			title: "Your Q3 Recap",
			component: (recap: IRecap) => <QuarterRecapSection recap={recap} quarter={3} />,
		},
		{
			id: "q4",
			title: "Your Q4 Recap",
			component: (recap: IRecap) => <QuarterRecapSection recap={recap} quarter={4} />,
		},
		{
			id: "overview",
			title: "Overview",
			component: (recap: IRecap) => <OverviewSection recap={recap} year={yearParam()} />,
		},
	];

	return (
		<div class="relative bg-neutral-850 p-2 snap-y snap-mandatory h-full overflow-y-scroll w-screen overflow-x-hidden">
			<Show when={recap.data()} keyed>
				{(data) => (
					<For each={sections}>
						{({ id, component, title }, index) => (
							<Section
								id={id}
								previousId={sections[index() - 1]?.id}
								nextId={sections[index() + 1]?.id}
								title={title}
							>
								{component(data)}
							</Section>
						)}
					</For>
				)}
			</Show>
		</div>
	);
};
