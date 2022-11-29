import { AppDrawer, MobileAppDrawer } from "./AppDrawer";
import { AppHeader } from "./AppHeader";
import { BackgroundLogo } from "./BackgroundLogo";
import { CatJamManager } from "./CatJam";
import { ExternalDragDrop } from "./ExternalDragDrop";
import { InstallPrompt } from "./InstallPrompt";
import { MemberListDrawer } from "./MemberListDrawer";
import { QuickAddModal } from "./QuickAddModal";
import { UpdateModal } from "./UpdateModal";

export const App = {
	Drawer: AppDrawer,
	MobileDrawer: MobileAppDrawer,
	Header: AppHeader,
	CatJamManager,
	UpdateModal,
	InstallPrompt,
	QuickAddModal,
	MemberListDrawer,
	BackgroundLogo,
	ExternalDragDrop,
};
