import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { GetStaticPaths } from "next";
import { Params } from "next/dist/server/request/params";
import { RequestOffersList } from "@/lists/request-offers-list";

export default function OfferList() {
  const pt = useTranslations("Pages.SignUp");

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-row justify-center">
        <section className="flex flex-col items-start gap-4 mx-auto p-4 container">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-2xl">
              Ofertas do Chamado
            </h1>
          </div>
          <RequestOffersList />
        </section>
      </Body>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = getStaticPropsWithMessages;
