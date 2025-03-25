import Layout from "@/components/layout";
import { getPortfolioStaticPropsWithMessages } from "@/lib/getStaticProps";
import { ArrowUpRight02Icon } from "@hugeicons/react";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Layout className="flex flex-col gap-8 pt-40 w-full">
      <Head>
        <title>{t("Pages.Index.meta.title")}</title>
        <meta name="description" content={t("Pages.Index.meta.description")} />
      </Head>
      <section className="flex flex-col items-start gap-4 mx-auto p-4 container">
        <h1 className="font-mono font-light text-gray-800 dark:text-gray-200 text-2xl">
          {t("Pages.Index.title")}
        </h1>
        <h1 className="max-w-md font-inter font-bold text-gray-800 dark:text-gray-200 text-4xl">
          {t("Pages.Index.subtitle")}
        </h1>
        <p className="font-inter text-gray-700 dark:text-gray-300 text-sm">
          {t("Pages.Index.descriptions")}
        </p>
        <Button
          href="/about"
          onPress={() => {
            router.push("/about", undefined, { locale: router.locale });
          }}
          className="bg-green-500 !text-white dark:text-gray-700"
        >
          {t("UI.redirects.see_more")} <ArrowUpRight02Icon variant="duotone" />
        </Button>
      </section>
    </Layout>
  );
}

export const getStaticProps = getPortfolioStaticPropsWithMessages;
