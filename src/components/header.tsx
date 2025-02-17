import Link from "next/link";
import React from "react";
import Agrofast from "@/components/ui/agrofast";

import dynamic from "next/dynamic";
import { LazyThemeSwitcher } from "@/components/ui/theme-switcher";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LazyLanguageSelector } from "@/components/ui/language-selector";
import { getPortfolioUrl } from "@/lib/utils";

const ThemeSwitcher = dynamic(() => import("@/components/ui/theme-switcher"), {
  ssr: false,
  loading: () => <LazyThemeSwitcher />,
});

const LanguageSelector = dynamic(() => import("@/components/ui/language-selector"), {
  ssr: false,
  loading: () => <LazyLanguageSelector />,
});

const Header: React.FC = () => {
  const t = useTranslations();

  return (
    <AnimatePresence>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="top-0 left-0 z-50 fixed bg-slate-50/60 dark:bg-stone-900/60 shadow-sm backdrop-blur-sm border-b dark:border-b-stone-950/50 w-full transition-colors"
      >
        <div className="flex justify-between items-center mx-auto p-4 container">
          <div className="flex flex-row flex-1 justify-start items-center gap-4">
            <Link href="/">
              <Agrofast.Logo className="w-36 h-9 translate-y-1" />
            </Link>
          </div>
          <div className="md:block space-x-4 hidden">
            <Link
              href={`${getPortfolioUrl()}/about`}
              className="font-bold text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-gray-200 hover:underline"
            >
              {t("UI.redirects.about") as string}
            </Link>
            <Link
              href={`${getPortfolioUrl()}/download`}
              className="font-bold text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-gray-200 hover:underline"
            >
              {t("UI.redirects.application") as string}
            </Link>
          </div>
          <div className="flex flex-row flex-1 justify-end items-center gap-4">
            <LanguageSelector className="text-2xl" />
            <ThemeSwitcher className="text-2xl" />
          </div>
        </div>
      </motion.header>
    </AnimatePresence>
  );
};

export default Header;
