import { Logout2, Settings } from "@solar-icons/react";
import IconOption from "../ui/icon-option";
import { useTheme } from "next-themes";
import ThemeUserFeedback from "./theme-user-feedback";
import { useAuth } from "@/contexts/auth-provider";
import { useTranslations } from "next-intl";
import userPicture from "@public/img/user-default.png";
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@heroui/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const UserOptionsButton: React.FC = () => {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!user) {
    return <LazyUserOptionsMenu />;
  }

  return (
    <>
      <Popover radius="sm" placement="bottom-end">
        <PopoverTrigger>
          <Button
            as={Button}
            radius="md"
            className="data-[aria-expanded=true]:blur-md"
            isIconOnly
          >
            <Avatar
              src={user?.profile_picture}
              radius="md"
              fallback={<Avatar src={userPicture.src} radius="md" />}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "flex flex-col gap-0 p-1 w-full min-w-44 h-min text-gray-700 dark:text-gray-200 transition-all",
            isModalOpen && "opacity-25 duration-100 pointer-events-none"
          )}
        >
          <p className="p-1 border-b border-b-neutral-200 dark:border-b-neutral-800 w-full text-start">
            {user.name}
          </p>
          <IconOption href="/web/profile" icon={<Settings />}>
            {t("UI.redirects.profile")}
          </IconOption>
          <IconOption
            href="/web"
            onClick={toggleTheme}
            className="md:hidden flex"
            icon={<ThemeUserFeedback />}
          >
            {t("UI.redirects.change_theme")}
          </IconOption>
          <IconOption
            onClick={logout}
            href="/web/login"
            icon={<Logout2 />}
            confirmAction
            confirmActionInfo={{
              actionConfirmTitle: t("UI.redirects.logout"),
              onConfirmModalChanged: setIsModalOpen,
            }}
          >
            {t("UI.redirects.logout")}
          </IconOption>
        </PopoverContent>
      </Popover>
    </>
  );
};

export const LazyUserOptionsMenu: React.FC = () => {
  return (
    <Button isIconOnly>
      <Spinner size="sm" color="default" />
    </Button>
  );
};

export default UserOptionsButton;
