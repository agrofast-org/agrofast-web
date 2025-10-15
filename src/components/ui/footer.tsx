"use client";
import React from "react";
import { domAnimation, LazyMotion, motion } from "framer-motion";
import { useApp } from "@/contexts/app-context";
import { cn } from "@heroui/react";

export interface FooterProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  shouldHideOnScroll?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  children,
  className,
  shouldHideOnScroll = true,
  ...props
}) => {
  const { headerVisible } = useApp();

  if (!children) {
    return null;
  }

  return (
    <LazyMotion features={domAnimation}>
      <nav className="flex justify-center items-center gap-4 w-full h-[65px] overflow-hidden">
        <motion.footer
          animate={shouldHideOnScroll && !headerVisible ? "hidden" : "visible"}
          initial={false}
          variants={{
            visible: {
              y: 0,
              transition: {
                ease: "easeOut",
              },
            },
            hidden: {
              y: "100%",
              transition: {
                ease: "easeIn",
              },
            },
          }}
          className={cn(
            "bottom-0 left-0 z-40 fixed",
            "flex justify-center bg-background/70 shadow-sm backdrop-blur-lg data-[menu-open=true]:backdrop-blur-xl backdrop-saturate-150 px-10 border-divider border-t data-[menu-open=true]:border-none w-full h-auto transition-colors",
            className
          )}
          {...props}
        >
          <div className="flex flex-row flex-nowrap justify-between items-center gap-4 w-full max-w-[1034px] h-full container">
            {children}
          </div>
        </motion.footer>
      </nav>
    </LazyMotion>
  );
};
