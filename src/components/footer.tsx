import React from "react";
import { motion } from "framer-motion";
import TabItem from "./tab-item";
import Icon from "./icon";
import { Chatting01StrokeRounded, Home01StrokeRounded, UserStrokeRounded } from "@hugeicons-pro/core-stroke-rounded";
import { Chatting01SolidRounded, Home01SolidRounded, UserSolidRounded } from "@hugeicons-pro/core-solid-rounded";

const Footer: React.FC = () => {
  return (
    <motion.footer className="sm:hidden bottom-0 left-0 z-50 fixed flex bg-slate-50/95 dark:bg-stone-900/95 shadow-sm backdrop-blur-sm border-t dark:border-t-stone-950/50 w-full transition-colors">
      <div className="flex justify-around items-center mx-auto p-2 px-0 container">
        <TabItem label="Chat" href="/web/chat">
          {({ active }) => (
            <Icon
              icon={Chatting01StrokeRounded}
              altIcon={Chatting01SolidRounded}
              showAlt={active}
            />
          )}
        </TabItem>
        <TabItem label="Home" href="/web">
          {({ active }) => (
            <Icon
              icon={Home01StrokeRounded}
              altIcon={Home01SolidRounded}
              showAlt={active}
            />
          )}
        </TabItem>
        <TabItem label="User" href="/web/profile">
          {({ active }) => (
            <Icon
              icon={UserStrokeRounded}
              altIcon={UserSolidRounded}
              showAlt={active}
            />
          )}
        </TabItem>
      </div>
    </motion.footer>
  );
};

export default Footer;
