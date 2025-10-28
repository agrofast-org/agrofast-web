import { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import { cn, isTextInput } from "@/lib/utils";
import Loading from "@/components/loading";
import { Footer } from "./footer";

interface BodyProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
  shouldHideHeaderOnScroll?: boolean;
  hideFooter?: boolean;
  shrinkOnMobileKeyboardUp?: boolean;
}

const Body: React.FC<BodyProps> = ({
  style,
  className,
  children,
  hideHeader,
  shouldHideHeaderOnScroll,
  hideFooter,
  shrinkOnMobileKeyboardUp = false,
}) => {
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const baseHeight = useRef<number>(0);
  const lastVisualHeight = useRef<number>(0);
  const activeInput = useRef<boolean>(false);

  useEffect(() => {
    baseHeight.current = typeof window !== "undefined" ? window.innerHeight : 0;
    setViewportHeight(baseHeight.current);

    const updateFromVisual = () => {
      if (!window.visualViewport) return;

      if (window.visualViewport.scale && window.visualViewport.scale !== 1) {
        return;
      }

      const current = window.visualViewport.height;
      lastVisualHeight.current = current;

      const diff = baseHeight.current - current;

      const bigDiff = diff > 150;

      if (bigDiff || activeInput.current) {
        setViewportHeight(current);
      } else {
        setViewportHeight(baseHeight.current);
      }
    };

    const onResize = () => {
      if (window.visualViewport) {
        updateFromVisual();
      } else {
        const h = window.innerHeight;

        if (Math.abs(h - baseHeight.current) < 100) {
          setViewportHeight(baseHeight.current);
        } else {
          setViewportHeight(h);
        }
      }
    };

    const onFocusIn = (e: FocusEvent) => {
      activeInput.current = isTextInput(e.target as Element);
      if (!shrinkOnMobileKeyboardUp) return;

      if (window.visualViewport) {
        if (window.visualViewport.scale && window.visualViewport.scale !== 1) {
          setViewportHeight(baseHeight.current - 300);
          return;
        }
        const current = window.visualViewport.height;
        lastVisualHeight.current = current;
        setViewportHeight(current);
      } else {
        setViewportHeight(baseHeight.current - 320);
      }
    };

    const onFocusOut = () => {
      activeInput.current = false;

      setTimeout(() => {
        if (window.visualViewport) {
          if (
            window.visualViewport.scale &&
            window.visualViewport.scale !== 1
          ) {
            setViewportHeight(baseHeight.current);
          } else {
            const curr = window.visualViewport.height;
            if (baseHeight.current - curr > 150) {
              setViewportHeight(curr);
            } else {
              setViewportHeight(baseHeight.current);
            }
          }
        } else {
          setViewportHeight(baseHeight.current);
        }
      }, 50);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateFromVisual);
      window.visualViewport.addEventListener("scroll", updateFromVisual);
    } else {
      window.addEventListener("resize", onResize);
    }
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    const onOrientation = () => {
      baseHeight.current = window.innerHeight;
      setViewportHeight(baseHeight.current);
    };
    window.addEventListener("orientationchange", onOrientation);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateFromVisual);
        window.visualViewport.removeEventListener("scroll", updateFromVisual);
      } else {
        window.removeEventListener("resize", onResize);
      }
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, [shrinkOnMobileKeyboardUp]);

  useEffect(() => {
    if (!shrinkOnMobileKeyboardUp) {
      setViewportHeight(typeof window !== "undefined" ? window.innerHeight : 0);
    }
  }, [shrinkOnMobileKeyboardUp]);

  return (
    <>
      <Loading />
      {!hideHeader && <Header shouldHideOnScroll={shouldHideHeaderOnScroll} />}
      <main
        className={cn(
          "w-full overflow-y-auto transition-all",
          !hideFooter && "pb-16 sm:pb-4",
          className
        )}
        style={{
          ...style,
          height:
            shrinkOnMobileKeyboardUp && viewportHeight
              ? `${viewportHeight}px`
              : "100dvh",
        }}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default Body;
