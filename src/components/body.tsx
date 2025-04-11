import Header from "./header";
import { cn } from "@/lib/utils";
import Loading from "./loading";
import { motion } from "framer-motion";
import TabItem from "./tab-item";
import { Chatting01Icon, Home01Icon, UserIcon } from "@hugeicons/react";

interface BodyProps {
  className?: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
}

const Body: React.FC<BodyProps> = ({ className, children, hideHeader }) => {
  return (
    <>
      <Loading />
      {!hideHeader && <Header />}
      <main
        className={cn(
          "bg-slate-50 dark:bg-neutral-900 w-full h-min min-h-svh transition-colors",
          !hideHeader && "pt-20",
          className
        )}
      >
        {children}
      </main>
      <motion.footer className="sm:hidden bottom-0 left-0 z-50 fixed flex bg-slate-50/95 dark:bg-stone-900/95 shadow-sm backdrop-blur-sm border-t dark:border-t-stone-950/50 w-full transition-colors">
        <div className="flex justify-around items-center mx-auto p-2 px-0 container">
          <TabItem label="Chat" href="/web/chat">
            {({ active }) => (
              <Chatting01Icon variant={active ? "solid" : "stroke"} />
            )}
          </TabItem>
          <TabItem label="Home" href="/web">
            {({ active }) => (
              <Home01Icon variant={active ? "solid" : "stroke"} />
            )}
          </TabItem>
          <TabItem label="User" href="/web/profile">
            {({ active }) => <UserIcon variant={active ? "solid" : "stroke"} />}
          </TabItem>
        </div>
      </motion.footer>
    </>
  );
};

export default Body;
