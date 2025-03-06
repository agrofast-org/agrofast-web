import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import { useOverlay } from "@/contexts/overlay-provider";
import { useTranslations } from "next-intl";

const Loading = () => {
  const t = useTranslations();

  const { isLoading, isPageLoading, message, pageMessage } = useOverlay();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isPageLoading ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className={cn(
          isPageLoading ? "pointer-events-auto" : "pointer-events-none",
          "flex flex-col gap-8 items-center justify-center",
          "transition-all fixed inset-0 z-[150]",
          "text-slate-800 dark:text-slate-50 bg-zinc-400/90 dark:bg-zinc-800/90 backdrop-blur-md"
        )}
      >
        <Spinner
          size="lg"
          color="current"
          className={cn(
            isPageLoading ? "pointer-events-auto" : "pointer-events-none"
          )}
        />
        {pageMessage && (
          <div
            className={cn(
              isPageLoading ? "pointer-events-auto" : "pointer-events-none",
              "max-w-56 font-medium text- text-center"
            )}
          >
            {t(pageMessage as never)}
          </div>
        )}
      </motion.div>
      {!isPageLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            isLoading ? "pointer-events-auto" : "pointer-events-none",
            "flex flex-col gap-8 items-center justify-center",
            "transition-all fixed w-screen h-screen top-0 left-0 z-[150]",
            "text-slate-800 dark:text-slate-50 bg-zinc-400/35 dark:bg-zinc-800/35 backdrop-blur-[1px]"
          )}
        >
          <Spinner
            size="lg"
            color="current"
            className={cn(
              isLoading ? "pointer-events-auto" : "pointer-events-none"
            )}
          />
          {message && (
            <div
              className={cn(
                isLoading ? "pointer-events-auto" : "pointer-events-none",
                "max-w-56 font-medium text- text-center"
              )}
            >
              {t(message as never)}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default Loading;
