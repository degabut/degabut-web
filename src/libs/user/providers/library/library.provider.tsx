import { useApi } from "@common";
import { type IMediaSource } from "@media-source";
import dayjs from "dayjs";
import {
	createContext,
	createMemo,
	createResource,
	createSignal,
	useContext,
	type InitializedResource,
	type ParentComponent,
	type ResourceActions,
} from "solid-js";
import { UserApi, type IMonthlyPlayActivity } from "../../apis";

const getRandomActivityRange = (data: IMonthlyPlayActivity[], minUniquePlayCount = 100, maxMonthRange = 6) => {
	const sixMonthsAgo = dayjs().subtract(6, "month").toDate();
	data = data
		.filter((a) => {
			// filter out recent 6 months
			return a.date < sixMonthsAgo;
		})
		.reverse();

	if (data.length === 0) {
		return {
			from: null,
			to: null,
			months: [],
		};
	}

	// Start with a random month
	const startIndex = Math.floor(Math.random() * data.length);
	const selectedMonths: typeof data = [data[startIndex]];
	let totalUniquePlayCount = data[startIndex].uniquePlayCount;

	// If we already meet the minimum, return early
	if (totalUniquePlayCount >= minUniquePlayCount) {
		return {
			from: selectedMonths.at(0)?.date || null,
			to: selectedMonths.at(-1)?.date || null,
			months: selectedMonths,
		};
	}

	// Expand search in both directions until we meet the minimum or hit max range
	let leftIndex = startIndex - 1;
	let rightIndex = startIndex + 1;

	while (
		totalUniquePlayCount < minUniquePlayCount &&
		selectedMonths.length < maxMonthRange &&
		(leftIndex >= 0 || rightIndex < data.length)
	) {
		// Randomly choose to expand left or right (if both are available)
		const canExpandLeft = leftIndex >= 0;
		const canExpandRight = rightIndex < data.length;

		if (canExpandLeft && canExpandRight) {
			// Randomly choose direction
			if (Math.random() < 0.5) {
				selectedMonths.unshift(data[leftIndex]);
				totalUniquePlayCount += data[leftIndex].uniquePlayCount;
				leftIndex--;
			} else {
				selectedMonths.push(data[rightIndex]);
				totalUniquePlayCount += data[rightIndex].uniquePlayCount;
				rightIndex++;
			}
		} else if (canExpandLeft) {
			selectedMonths.unshift(data[leftIndex]);
			totalUniquePlayCount += data[leftIndex].uniquePlayCount;
			leftIndex--;
		} else if (canExpandRight) {
			selectedMonths.push(data[rightIndex]);
			totalUniquePlayCount += data[rightIndex].uniquePlayCount;
			rightIndex++;
		}
	}

	// return beginning and end of the selected months
	return {
		from: selectedMonths.at(0)?.date || null,
		to: selectedMonths.at(-1)?.date || null,
		months: selectedMonths,
	};
};

export type LibraryContextStore = {
	load: () => void;
	monthlyPlayActivity: InitializedResource<IMonthlyPlayActivity[] | null>;
	lastPlayed: InitializedResource<IMediaSource[]>;
	lastPlayedAction: ResourceActions<IMediaSource[]>;
	mostPlayed: InitializedResource<IMediaSource[]>;
	mostPlayedAction: ResourceActions<IMediaSource[]>;
	oldMostPlayed: InitializedResource<IMediaSource[]>;
	oldMostPlayedAction: ResourceActions<IMediaSource[]>;
	recentMostPlayed: InitializedResource<IMediaSource[]>;
	recentMostPlayedAction: ResourceActions<IMediaSource[]>;
	lastLiked: InitializedResource<IMediaSource[]>;
	lastLikedAction: ResourceActions<IMediaSource[]>;
	isEmpty: () => boolean;
};

export const LibraryContext = createContext<LibraryContextStore>();

export type FreezeState = {
	queue: boolean;
	track: boolean;
	seek: boolean;
};

export const LibraryProvider: ParentComponent = (props) => {
	const api = useApi();
	const user = new UserApi(api.client);
	const [isInitialized, setIsInitialized] = createSignal(false);

	const load = () => {
		setIsInitialized(true);
	};

	const [monthlyPlayActivity] = createResource<null | IMonthlyPlayActivity[]>(
		() => {
			const now = new Date();
			const params = {
				to: new Date(now.getFullYear(), now.getMonth(), 0),
				from: new Date(now.setFullYear(now.getFullYear() - 3)),
			};
			return user.getMonthlyPlayActivity(params);
		},
		{ initialValue: null }
	);

	const [lastPlayed, lastPlayedAction] = createResource(
		isInitialized,
		(isInitialized) => {
			if (!isInitialized) return [];

			const params = { last: 10 };
			return user.getPlayHistory(params);
		},
		{ initialValue: [] }
	);

	const [recentMostPlayed, recentMostPlayedAction] = createResource(
		isInitialized,
		(isInitialized) => {
			if (!isInitialized) return [];

			const params = { days: 14, count: 10 };
			return user.getPlayHistory(params);
		},
		{ initialValue: [] }
	);

	const [mostPlayed, mostPlayedAction] = createResource(
		isInitialized,
		(isInitialized) => {
			if (!isInitialized) return [];

			const params = { days: 30, count: 10 };
			return user.getPlayHistory(params);
		},
		{ initialValue: [] }
	);

	const [oldMostPlayed, oldMostPlayedAction] = createResource(
		() => [isInitialized(), monthlyPlayActivity()] as const,
		([isInitialized, monthlyPlayActivity]) => {
			if (!isInitialized || !monthlyPlayActivity) return [];

			const { from, to } = getRandomActivityRange(monthlyPlayActivity, 100, 6);
			if (!from || !to) return [];

			const excludeTo = new Date();
			const excludeFrom = dayjs(excludeTo).subtract(180, "days").toDate();

			const params = {
				from: dayjs(from).startOf("month").toDate(),
				to: dayjs(to).endOf("month").toDate(),
				excludeFrom,
				excludeTo,
				limit: 30,
				excludeTopPercent: 0.25,
			};
			return user.getMostPlayed(params);
		},
		{ initialValue: [] }
	);

	const [lastLiked, lastLikedAction] = createResource(
		isInitialized,
		async (isInitialized) => {
			if (!isInitialized) return [];

			const result = await user.getLikedMediaSource(1, 10);
			return result.map((r) => r.mediaSource);
		},
		{ initialValue: [] }
	);

	const isEmpty = createMemo(() => {
		return (
			!mostPlayed().length &&
			!mostPlayed.loading &&
			!lastPlayed().length &&
			!lastPlayed.loading &&
			!lastLiked().length &&
			!lastLiked.loading
		);
	});

	const store = {
		load,
		monthlyPlayActivity,
		lastPlayed,
		lastPlayedAction,
		mostPlayed,
		mostPlayedAction,
		oldMostPlayed,
		oldMostPlayedAction,
		recentMostPlayed,
		recentMostPlayedAction,
		lastLiked,
		lastLikedAction,
		isEmpty,
	};

	return <LibraryContext.Provider value={store}>{props.children}</LibraryContext.Provider>;
};

export const useLibrary = () => useContext(LibraryContext);
