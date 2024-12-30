import Head from "next/head";
import Header from "./header";
import { cn } from "@/lib/utils";
import Loading from "./loading";

interface BodyProps {
  className?: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
}

const Body: React.FC<BodyProps> = ({ className, children, hideHeader }) => {
  return (
    <>
      <Loading />
      <Head>
        <title>Agrofast</title>
      </Head>
      {!hideHeader && <Header />}
      <main
        className={cn(
          "transition-colors w-full min-h-svh overflow-hidden overflow-y-auto bg-slate-50 dark:bg-neutral-900",
          className
        )}
      >
        {children}
      </main>
    </>
  );
};

export default Body;
