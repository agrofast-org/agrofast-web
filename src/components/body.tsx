import Header from "@/components/header";
import { cn } from "@/lib/utils";
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
}) => {
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
        }}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default Body;
