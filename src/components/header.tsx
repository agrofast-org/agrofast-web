import React, { useId } from "react";
import TerraMov from "@/components/ui/agrofast";

import dynamic from "next/dynamic";
import { LazyThemeSwitcher } from "@/components/ui/theme-switcher";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Link from "@/components/link";
import { useAuth } from "@/contexts/auth-provider";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import CompactLanguageSelector from "./ux/compact-language-selector";
import { useDebounce } from "@/hooks/use-debounce";
import { useApp } from "@/contexts/app-context";
import { UserOptionsButton } from "./ux/user-options-button";
import { UserNotificationButton } from "./ux/user-notifications-button";
import { OpenSupportOption } from "./ui/open-support-ticket";

const ThemeSwitcher = dynamic(() => import("@/components/ui/theme-switcher"), {
  ssr: false,
  loading: () => <LazyThemeSwitcher />,
});

export interface HeaderProps {
  shouldHideOnScroll?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  shouldHideOnScroll = true,
}) => {
  const id = useId();

  const t = useTranslations();
  const { user } = useAuth();
  const { mounted } = useApp();

  const { setHeaderVisible } = useApp();

  const [debounce] = useDebounce(() => {
    setHeaderVisible(
      document?.getElementById(id)?.getAttribute("data-hidden") !== "true"
    );
  }, 1);

  return (
    <Navbar
      id={id}
      isBordered
      className="bg-default-50 shadow-sm backdrop-blur-sm border-default-300 dark:border-default-100 w-full transition-colors"
      onScrollPositionChange={debounce}
      shouldHideOnScroll={shouldHideOnScroll}
    >
      <NavbarBrand className="flex flex-row flex-1 justify-start items-center gap-4">
        <NavbarBrand>
          <Link href="/web">
            <TerraMov.Logo className="w-36 h-9" />
          </Link>
        </NavbarBrand>
      </NavbarBrand>
      <NavbarContent className="hidden md:flex" justify="center">
        {mounted && user && (
          <>
            <NavbarItem>
              <Link
                href="/web"
                className="font-bold text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-gray-200 hover:underline"
              >
                {user?.profile_type === "requester" && "Mapa"}
                {user?.profile_type === "transporter" && "Serviços"}
              </Link>
            </NavbarItem>
            {user?.profile_type === "requester" && (
              <>
                <NavbarItem>
                  <Link
                    href="/web/machinery"
                    className="font-bold text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-gray-200 hover:underline"
                  >
                    {t("UI.labels.machinery") as string}
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link
                    href="/web/request"
                    className="font-bold text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-gray-200 hover:underline"
                  >
                    {t("UI.labels.requests") as string}
                  </Link>
                </NavbarItem>
              </>
            )}
            {user?.profile_type === "transporter" && (
              <NavbarItem>
                <Link
                  href="/web/carrier"
                  className="font-bold text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-gray-200 hover:underline"
                >
                  {t("UI.labels.carrier") as string}
                </Link>
              </NavbarItem>
            )}
          </>
        )}
      </NavbarContent>
      <NavbarContent
        className="flex flex-row flex-1 items-center gap-2"
        justify="end"
      >
        <CompactLanguageSelector className="" />
        {mounted && user && (
          <NavbarItem className="flex justify-center items-center">
            <OpenSupportOption />
          </NavbarItem>
        )}
        <NavbarItem>
          <ThemeSwitcher className={cn(user ? "md:flex hidden" : "flex")} />
        </NavbarItem>
        {mounted && user && (
          <NavbarItem className="flex justify-center items-center">
            <UserNotificationButton />
          </NavbarItem>
        )}
        {mounted && user && (
          <NavbarItem className="flex justify-center items-center">
            <UserOptionsButton />
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
