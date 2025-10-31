import Body from "@/components/body";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { GetStaticPaths } from "next";
import { Params } from "next/dist/server/request/params";
import { ChatForm } from "@/forms/chat/chat-form";

export default function PrivateChat() {
  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="" />
      </Head>
      <Body
        hideHeader
        hideFooter
        className="flex flex-col absolute left-1/2 -translate-x-1/2 justify-center items-center !pb-0 border-divider border-x w-full max-w-xl overflow-y-auto h-dvh"
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
