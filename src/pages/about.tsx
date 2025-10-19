import { Layout } from "@/components/layout";
import Link from "@/components/link";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { getLegalUrl } from "@/lib/utils";
import Image from "next/image";
import goodDeals from "@public/assets/good-deals.png";
import productionAndAgility from "@public/assets/production-and-agility.png";
import { GoogleAuthButton } from "@/components/ui/google-auth-button";

export default function About() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Pages.About.meta.title")}</title>
        <meta name="description" content={t("Pages.About.meta.description")} />
      </Head>
      <GoogleAuthButton hidden />
      <Layout>
        <section className="flex flex-col items-start gap-6 mx-auto p-4 max-w-[912px] container">
          <div className="flex md:flex-row flex-col-reverse items-start gap-2 md:gap-6 mx-auto">
            <div className="flex flex-col justify-center md:bg-neutral-200/30 dark:md:bg-neutral-800/20 p-2 rounded-lg h-full md:h-44 transition-all">
              <p className="font-inter font-medium text-gray-700 dark:text-gray-300 indent-8">
                {t("Pages.About.paragraph_1")}
              </p>
            </div>
            <Image
              src={goodDeals.src}
              className="shadow-sm rounded-lg min-w-full md:min-w-60 max-h-52 md:max-h-44 object-cover"
              width={300}
              height={250}
              alt=""
            />
          </div>
          <div className="flex md:flex-row flex-col items-start gap-2 md:gap-6 mx-auto">
            <Image
              src={productionAndAgility.src}
              className="shadow-sm rounded-lg min-w-full md:min-w-60 max-h-52 md:max-h-64 object-cover object-top"
              width={300}
              height={250}
              alt=""
            />
            <div className="flex flex-col justify-center md:bg-neutral-200/30 dark:md:bg-neutral-800/20 p-2 rounded-lg h-full md:h-64 transition-all">
              <p className="font-inter font-medium text-gray-700 dark:text-gray-300 indent-8">
                {t("Pages.About.paragraph_2")}
              </p>
            </div>
          </div>
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
                <Link target="_blank" href={`${getLegalUrl()}/terms-of-use`}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
          {/* <Button
          onPress={() => {
            router.push("/download");
          }}
          className="bg-purple-500 !text-white"
        >
          {t("UI.redirects.go_to_download")}{" "}
          <ArrowUpRight02Icon variant="duotone" />
        </Button> */}
        </section>
      </Layout>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
