import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { List } from "@solar-icons/react";

export default function Index() {
  const pt = useTranslations("Pages.SignUp");

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-row justify-center">
        <section className="flex flex-row items-start gap-4 mx-auto p-4 container">
          <List >

          </List>
        </section>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
