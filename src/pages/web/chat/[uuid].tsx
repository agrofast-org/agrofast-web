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
        <title></title>
        <meta name="description" content="" />
      </Head>
      <Body
        shouldHideHeaderOnScroll={false}
        hideFooter
        className="flex flex-col items-center !pb-0 h-[calc(100vh-65px)]"
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
