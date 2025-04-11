import { cn } from "@/lib/utils";
import Header from "./header";
import Loading from "./loading";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ className, children, hideHeader }) => {
  return (
    <>
      <Loading />
      {!hideHeader && <Header />}
      <main
        className={cn(
          "bg-slate-50 dark:bg-neutral-900 pb-16 sm:pb-4 w-full min-h-svh overflow-hidden overflow-y-auto transition-colors",
          className
        )}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
