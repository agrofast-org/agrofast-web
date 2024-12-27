import Body from "@/components/body";
import Agrofast from "@/components/ui/agrofast";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";
import { useTranslations } from "next-intl";
import Head from "next/head";

export default function InternalError() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("InternalError.meta_title")}</title>
        <meta name="description" content={t("InternalError.meta_description_1")} />
      </Head>
      <Body className="" hideHeader>
        <div className="flex flex-1 justify-center md:items-center pt-8 md:pt-0 h-svh max-h-svh overflow-hidden overflow-y-auto">
          <div className="flex flex-col gap-4 px-8 py-6 w-full max-w-md min-h-max">
            <div className="flex flex-col items-center">
              <Agrofast.Logo className="w-72 h-min" />
              <p className="py-2 font-semibold text-2xl text-center text-gray-700 dark:text-gray-200">
                {t("InternalError.an_error_has_occurred")}
              </p>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
