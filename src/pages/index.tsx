import Body from "@/components/body";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";
import { useTranslations } from "next-intl";
import Head from "next/head";

export default function Index() {
  const t = useTranslations();
  return (
    <>
      <Head>
        <title>{t("Index.meta_title")}</title>
        <meta name="description" content={t("Index.meta_description_1")} />
      </Head>
      <Body></Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
