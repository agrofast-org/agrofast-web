import {
  ChatLine,
  Logout2,
  Map,
  Routing2,
  Settings,
  Wheel,
} from "@solar-icons/react";
import IconOption from "../ui/icon-option";
import { useTheme } from "next-themes";
import ThemeUserFeedback from "./theme-user-feedback";
import { useAuth } from "@/contexts/auth-provider";
import { useTranslations } from "next-intl";
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Spinner,
} from "@heroui/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Avatar } from "../avatar";

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
    <Popover radius="sm" placement="bottom-end" offset={8}>
      <PopoverTrigger>
        <Button
          radius="md"
          className="data-[aria-expanded=true]:blur-md"
          isIconOnly
        >
          <Avatar src={user?.profile_picture} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "flex flex-col gap-0 p-1 w-full min-w-44 h-min text-gray-700 dark:text-gray-200 transition-all",
          isModalOpen && "opacity-25 duration-100 pointer-events-none"
        )}
      >
        <Skeleton className="rounded-lg w-full" isLoaded={!!user}>
          <p className="p-1 w-full text-start">{user?.name}</p>
        </Skeleton>
        <Divider className={!user ? "hidden" : ""} />
        <IconOption href="/web/profile" icon={<Settings />}>
          {t("UI.redirects.profile")}
        </IconOption>
        <IconOption
          onClick={toggleTheme}
          className="md:hidden flex"
          icon={<ThemeUserFeedback />}
        >
          {t("UI.redirects.change_theme")}
        </IconOption>
        <IconOption icon={<ChatLine />} href="/web/chat">
          Chat
        </IconOption>
        {user?.profile_type === "requester" && (
          <>
            <IconOption icon={<Map />} href="/web">
              Mapa
            </IconOption>
            <IconOption icon={<Wheel />} href="/web/machinery">
              Maquinarios
            </IconOption>
            <IconOption icon={<Routing2 />} href="/web/request">
              Chamados
            </IconOption>
          </>
        )}
        {user?.profile_type === "transporter" && (
          <>
            <IconOption icon={<Map />} href="/web">
              Serviços
            </IconOption>
            <IconOption icon={<Wheel />} href="/web/carrier">
              Veículos de transporte
            </IconOption>
          </>
        )}
        <IconOption
          onClick={logout}
          icon={<Logout2 />}
          confirmAction
          confirmActionInfo={{
            actionConfirmTitle: t("UI.redirects.logout"),
            onConfirmModalChanged: setIsModalOpen,
            actionConfirmButtonColor: "danger",
          }}
        >
          {t("UI.redirects.logout")}
        </IconOption>
      </PopoverContent>
    </Popover>
  );
};

export const LazyUserOptionsMenu: React.FC = () => {
  return (
    <Button isIconOnly>
      <Spinner color="current" className="text-default-500 scale-80" />
    </Button>
  );
};

export default UserOptionsButton;
