import { useNavigate as useSolidNavigate, type NavigateOptions as SolidNavigateOptions } from "@solidjs/router";
import { UrlUtil, type PatchPathParams } from "../utils";

type NavigateOptions = SolidNavigateOptions & {
	params: PatchPathParams;
};

export const useNavigate = <T extends string = string>() => {
	const _navigate = useSolidNavigate();

	const navigate = (to: T, options?: Partial<NavigateOptions>) => {
		_navigate(UrlUtil.patchPath(to as string, options?.params), options);
	};

	return navigate;
};
