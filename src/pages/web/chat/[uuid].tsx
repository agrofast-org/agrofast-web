import { useEffect, useState } from "react";
import Body from "@/components/body";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { GetStaticPaths } from "next";
import { Params } from "next/dist/server/request/params";
import { ChatForm } from "@/forms/chat/chat-form";

export default function PrivateChat() {
  const [viewportHeight, setViewportHeight] = useState("100dvh");

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      setViewportHeight(`${vh}px`);
    };

    updateHeight();

    window.visualViewport?.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("scroll", updateHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("scroll", updateHeight);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="" />
      </Head>
      <Body
        shouldHideHeaderOnScroll={false}
        hideFooter
        className="flex flex-col items-center !pb-0 transition-all duration-200"
        style={{ height: `calc(${viewportHeight} - 65px)` }}
      >
        <ChatForm />
      </Body>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = getStaticPropsWithMessages;
