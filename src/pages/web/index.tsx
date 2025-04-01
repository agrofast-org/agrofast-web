import Layout from "@/components/layout";
import { getWebStaticPropsWithMessages } from "@/lib/getStaticProps";
import { useTranslations } from "next-intl";
import Head from "next/head";

export default function Index() {
  // const t = useTranslations();
  const pt = useTranslations("Pages.Index");

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Layout className="flex flex-col gap-8 pt-20 w-full">
        <section className="flex flex-col items-start gap-4 mx-auto p-4 container">
          
        </section>
      </Layout>
    </>
  );
}

export const getStaticProps = getWebStaticPropsWithMessages;
