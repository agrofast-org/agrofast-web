import Header from "@/components/header";
import { cn } from "@/lib/utils";
import Loading from "@/components/loading";
import { Footer } from "./footer";

interface BodyProps {
  className?: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
  shouldHideHeaderOnScroll?: boolean;
  hideFooter?: boolean;
}

const Body: React.FC<BodyProps> = ({
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
          "bg-default-100 w-full h-min transition-colors",
          !hideFooter && "pb-16 sm:pb-4",
          className
        )}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default Body;
