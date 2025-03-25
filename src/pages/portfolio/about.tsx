import Layout from "@/components/layout";
import Link from "@/components/link";
import { getPortfolioStaticPropsWithMessages } from "@/lib/getStaticProps";
import { ArrowUpRight02Icon } from "@hugeicons/react";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/router";
import { getLegalUrl } from "@/lib/utils";

export default function About() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Layout className="flex flex-col gap-8 pt-24 w-full">
      <Head>
        <title>{t("Pages.About.meta.title")}</title>
        <meta name="description" content={t("Pages.About.meta.description")} />
      </Head>
      <section className="flex flex-col items-start gap-4 mx-auto p-4 container">
        <p className="font-inter font-normal text-gray-700 dark:text-gray-300">
          {t("Pages.About.paragraph_1")}
        </p>
        <p className="font-inter font-normal text-gray-700 dark:text-gray-300">
          {t("Pages.About.paragraph_2")}
        </p>
        <p className="font-inter font-normal text-gray-700 dark:text-gray-300">
          {t.rich("Pages.About.paragraph_3", {
            policies: (chunks) => (
              <Link
                target="_blank"
                href={`${getLegalUrl()}/privacy-policies`}
              >
                {chunks}
              </Link>
            ),
            terms: (chunks) => (
              <Link
                target="_blank"
                href={`${getLegalUrl()}/terms-of-use`}
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
        <Button
          onPress={() => {
            router.push("/download");
          }}
          className="bg-purple-500 !text-white"
        >
          {t("UI.redirects.go_to_download")}{" "}
          <ArrowUpRight02Icon variant="duotone" />
        </Button>
      </section>
    </Layout>
  );
}

export const getStaticProps = getPortfolioStaticPropsWithMessages;
