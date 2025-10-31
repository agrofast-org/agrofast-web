import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { Button } from "@heroui/react";
import Link from "next/link";
import { AddCircle } from "@solar-icons/react";
import { MachineryList } from "@/lists/machinery-list";

export default function Index() {
  const t = useTranslations();
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
              {t("Advertizement.titles.primary")}
            </h1>
            <Button
              as={Link}
              className="bg-default-200 text-default-700"
              href="/web/machinery/new"
            >
              {t("UI.titles.add", { item: t("UI.labels.machinery") })}{" "}
              <AddCircle weight="LineDuotone" />
            </Button>
          </div>
          <MachineryList />
        </section>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
