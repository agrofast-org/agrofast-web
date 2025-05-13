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
      <div
        className={cn(
          isPageLoading ? "pointer-events-auto" : "pointer-events-none",
          isPageLoading ? "opacity-100 duration-0" : "opacity-0 duration-250",
          "transition-all fixed inset-0 z-[150]",
          "flex flex-col gap-8 items-center justify-center",
          "text-default-800 bg-default-100 backdrop-blur-md"
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
              "max-w-56 font-medium text-center"
            )}
          >
            {t(pageMessage as never)}
          </div>
        )}
      </div>
      {!isPageLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            isLoading ? "pointer-events-auto" : "pointer-events-none",
            "transition-all fixed inset-0 z-[150]",
            "flex flex-col gap-8 items-center justify-center",
            "text-default-800 bg-default-100 backdrop-blur-[1px]"
          )}
          >
          <Spinner
            size="lg"
            color="current"
            className={cn(
              isLoading ? "pointer-events-auto" : "pointer-events-none",
              !message && "mb-14",
            )}
          />
          {message && (
            <div
              className={cn(
                isLoading ? "pointer-events-auto" : "pointer-events-none",
                "max-w-56 font-medium text-center"
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
