import Layout from "@/components/layout";
import { getPortfolioStaticPropsWithMessages } from "@/lib/getStaticProps";
import appDownload from "@public/app-download.png";
import appIcon from "@public/app-icon.png";
import { Download04Icon, Link01Icon } from "@hugeicons/react";
import { Button, Link } from "@heroui/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { getLegalUrl, getWebUrl } from "@/lib/utils";

export default function Download() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Layout className="flex flex-col items-center gap-8 pt-24 w-full">
      <Head>
        <title>{t("Pages.Download.meta.title")}</title>
        <meta
          name="description"
          content={t("Pages.Download.meta.description")}
        />
      </Head>
      <section className="relative flex flex-col items-start gap-4 p-4 container">
        <div className="flex gap-4">
          <Image
            width="400"
            height="400"
            src={appIcon}
            alt="App image"
            className="sm:top-4 sm:right-4 z-10 sm:absolute relative w-40 h-40"
          />
          <div>
            <h1 className="font-mono font-light text-gray-800 dark:text-gray-200 text-2xl">
              Agrofast
            </h1>
            <span className="flex gap-2 text-base">
              By
              <Link
                href="https://muriloelias.com"
                className="font-bold text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-gray-200 hover:underline"
              >
                Murilo Elias
              </Link>
            </span>
          </div>
        </div>
        <h1 className="max-w-md font-inter font-bold text-gray-800 dark:text-gray-200 text-4xl">
          {t("Pages.Download.app_description_1")}
        </h1>
        <p className="font-inter text-gray-700 dark:text-gray-300 text-sm">
          {t("Pages.Download.start_download_here")}
        </p>
        <p className="font-inter text-gray-700 dark:text-gray-300 text-sm">
          {t.rich("Pages.Download.find_our_policies", {
            policies: (chunks) => (
              <Link
                className="text-sm"
                target="_blank"
                href={`${getLegalUrl()}/privacy-policies`}
              >
                {chunks}
              </Link>
            ),
            terms: (chunks) => (
              <Link className="text-sm" target="_blank" href={`${getLegalUrl()}/terms-of-use`}>
                {chunks}
              </Link>
            ),
          })}
        </p>
        <div className="flex md:flex-row flex-col gap-4">
          <Button
            className="bg-blue-500 max-w-min !text-white"
            onPress={() => {
              const link = document.createElement("a");
              link.href = appDownload.src;
              link.download = "app-download.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            {t("UI.redirects.download_app")} <Download04Icon variant="solid" />
          </Button>
          <Button
            className="bg-emerald-600 !text-white"
            onPress={() => {
              router.push(`${getWebUrl()}/`);
            }}
          >
            {t("Pages.Download.or_redirect_to_web_version")}
            <Link01Icon variant="bulk" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps = getPortfolioStaticPropsWithMessages;
