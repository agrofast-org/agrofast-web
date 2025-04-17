import Layout from "@/components/layout";
import { getPortfolioStaticPropsWithMessages } from "@/lib/getStaticProps";

// import appDownload from "@public/img/app-download.png";
import appIcon from "@public/img/app-icon.png";
import greenFields from "@public/assets/green-fields.png";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/router";
import { getLegalUrl, getWebUrl } from "@/lib/utils";
import Link from "@/components/link";
import Image from "next/image";
import { ArrowRightUp, LinkRoundAngle } from "@solar-icons/react";

export default function Home() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Pages.Index.meta.title")}</title>
        <meta name="description" content={t("Pages.Index.meta.description")} />
      </Head>
      <Layout className="flex flex-col gap-0 pt-24 w-full">
        <section className="flex flex-row items-start gap-4 mx-auto p-4 container">
          <div className="flex flex-col items-start gap-4 mx-auto">
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
              {t("UI.redirects.see_more")}{" "}
              <ArrowRightUp />
            </Button>
          </div>
          <div className="flex flex-1 justify-end">
            <Image
              src={greenFields.src}
              alt="Example image"
              className="hidden md:block shadow-sm rounded-lg w-[440px] min-h-[220px] max-h-[220px] object-cover"
              width={330}
              height={220}
            />
          </div>
        </section>
        <section className="relative flex flex-col items-start gap-4 mx-auto p-4 container">
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
          <h3 className="max-w-md font-inter font-bold text-gray-800 dark:text-gray-200 text-2xl">
            {t("Pages.Index.app_description_1")}
          </h3>
          <p className="font-inter text-gray-700 dark:text-gray-300 text-sm">
            {t("Pages.Index.start_download_here")}
          </p>
          <p className="font-inter text-gray-700 dark:text-gray-300 text-sm">
            {t.rich("Pages.Index.find_our_policies", {
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
                <Link
                  className="text-sm"
                  target="_blank"
                  href={`${getLegalUrl()}/terms-of-use`}
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <div className="flex md:flex-row flex-col gap-4">
            {/* <Button
            className="bg-blue-500 max-w-min !text-white"
            onPress={() => {
              const link = document.createElement("a");
              link.href = appDownload.src;
              link.download = "app-download.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            disabled
          >
            {t("UI.redirects.download_app")} <Download04Icon variant="solid" />
          </Button> */}
            <Button
              className="bg-emerald-600 !text-white"
              onPress={() => {
                router.push(`${getWebUrl()}/`);
              }}
            >
              {t("Pages.Index.or_redirect_to_web_version")}
              <LinkRoundAngle weight="BoldDuotone" />
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
}

export const getStaticProps = getPortfolioStaticPropsWithMessages;
